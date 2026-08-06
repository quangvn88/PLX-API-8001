const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ExcelJS = require("exceljs");

const TEMPLATES_DIR = path.join(__dirname, "templates");

// Chỉ cho phép chữ/số/gạch dưới/gạch ngang — vừa khớp cách đặt tên file thực
// tế (AGR_06, BIDV_03, VCB_03, HDMBNT...) vừa chặn path traversal vì MABC ghép
// thẳng vào đường dẫn file bên dưới.
const MABC_PATTERN = /^[A-Za-z0-9_-]+$/;

// Định dạng template hỗ trợ: docx (docxtemplater) và xlsx (exceljs).
const TEMPLATE_EXTS = ["docx", "xlsx"];

const CONTENT_TYPES = {
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
};

// Đọc + validate MABC/FILE_TYPE dùng chung cho các hàm bên dưới. Truyền
// Tách đuôi file khi client gửi kèm trong tên ("BIDV_03.xlsx" -> BIDV_03 + xlsx).
const splitExt = (name) => {
    const matched = String(name || "").match(/^(.*)\.([A-Za-z0-9]+)$/);
    return matched ? { name: matched[1], ext: matched[2].toLowerCase() } : { name: String(name || ""), ext: "" };
};

// Chuẩn hoá đuôi file: ".XLSX" / "XLSX" / "xlsx" đều ra "xlsx".
const normalizeExt = (value) => String(value || "").trim().replace(/^\./, "").toLowerCase();

// Đọc + validate MABC/đuôi file dùng chung cho các hàm bên dưới.
// Đuôi file lấy theo thứ tự ưu tiên: EXTENSION (field SAP đang đẩy kèm MABC)
// -> đuôi kèm trong MABC ("BIDV_03.xlsx") -> đuôi của FILE_NAME -> FILE_TYPE
// -> `fixedExt` (đuôi gắn cứng theo FUNC của hàm gọi) -> "docx". Nhờ vậy SAP
// đẩy lên kiểu nào cũng lưu/đọc đúng đuôi, và client cũ chỉ gửi MABC trơn thì
// vẫn ra .docx như trước.
const parseRequest = (req, fixedExt) => {
    const data = (req.body || {}).DATA || {};
    const fromMaBc = splitExt(data.MABC);
    const fromFileName = splitExt(data.FILE_NAME || data.FILENAME);
    const maBc = fromMaBc.name;
    const ext =
        normalizeExt(data.EXTENSION) ||
        fromMaBc.ext ||
        fromFileName.ext ||
        normalizeExt(data.FILE_TYPE) ||
        fixedExt ||
        "docx";

    if (!maBc) {
        return { data, error: "Thiếu tham số MABC" };
    }

    if (!MABC_PATTERN.test(maBc)) {
        return { data, error: `MABC không hợp lệ: ${data.MABC}` };
    }

    if (!TEMPLATE_EXTS.includes(ext)) {
        return { data, error: `Đuôi file không hợp lệ: ${ext} (chỉ nhận ${TEMPLATE_EXTS.join(", ")})` };
    }

    // Hàm gen gắn cứng định dạng theo FUNC: request khai báo đuôi khác thì báo
    // lỗi rõ ràng thay vì lặng lẽ đọc nhầm file template.
    if (fixedExt && ext !== fixedExt) {
        return { data, error: `Yêu cầu file .${fixedExt} nhưng request khai báo .${ext}` };
    }

    const fileName = `${maBc}.${ext}`;
    return { data, maBc, ext, fileName, templatePath: path.join(TEMPLATES_DIR, fileName) };
};

// Generate văn bản dùng chung cho nhiều loại template: input là DATA.MABC +
// các field VAL01, VAL02, ... trong cùng DATA, map thẳng vào placeholder
// {VAL01}, {VAL02}, ... trong template. Tên file template = `${MABC}.docx`
// trong controllers/LDS/templates/ — thêm template mới chỉ cần bỏ file .docx
// đúng tên vào thư mục đó, không cần sửa code.
module.exports.generateDocxFromTemplate = async (req, res) => {
    const { data, maBc, error, templatePath } = parseRequest(req, "docx");

    if (error) {
        return res.status(400).json({ success: false, message: error });
    }

    if (!fs.existsSync(templatePath)) {
        return res.status(400).json({ success: false, message: `Không tìm thấy template cho MABC: ${maBc}` });
    }

    try {
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { linebreaks: true });
        doc.render(data);

        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        const fileName = `${maBc}_${Date.now()}.docx`;

        res.setHeader("Content-Type", CONTENT_TYPES.docx);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.send(buffer);
    } catch (error) {
        const details = error.properties?.errors?.map((e) => e.properties?.explanation) || error.message;
        res.status(500).json({ success: false, message: "Không thể tạo văn bản từ template", details });
    }
};

// ---------------------------------------------------------------------------
// XLSX
// docxtemplater bản free không xử lý .xlsx (module xlsx là bản trả phí) nên
// phần Excel tự render bằng exceljs, giữ nguyên quy ước placeholder của .docx:
//   - {VAL01}, {KH.TEN}  : thay bằng giá trị tương ứng trong DATA
//   - {#ITEMS} ... {/ITEMS} : block lặp theo DÒNG cho bảng chi tiết, hai marker
//     đặt ở dòng đầu và dòng cuối của block (có thể cùng một dòng). Trong block
//     dùng field của từng phần tử ({MATNR}), {_INDEX} là số thứ tự dòng (1..n),
//     {_VALUE} khi phần tử là giá trị đơn (mảng chuỗi/số).
// Lưu ý: exceljs ghi lại file nên các thành phần nó không hiểu (chart, pivot,
// VBA) sẽ mất — template Excel chỉ nên dùng cell/format/merge/công thức.
// ---------------------------------------------------------------------------

const PLACEHOLDER_PATTERN = /\{([A-Za-z0-9_.]+)\}/g;
const WHOLE_PLACEHOLDER_PATTERN = /^\s*\{([A-Za-z0-9_.]+)\}\s*$/;
const LOOP_OPEN_PATTERN = /\{#([A-Za-z0-9_.]+)\}/;
const LOOP_CLOSE_PATTERN = /\{\/([A-Za-z0-9_.]+)\}/;
const LOOP_MARKER_PATTERN = /\{[#/][A-Za-z0-9_.]+\}/g;
const MAX_LOOP_BLOCKS = 100; // chặn treo nếu marker vì lý do nào đó không xoá được

// Lấy giá trị theo key, hỗ trợ key lồng dạng "KH.TEN".
const getValue = (scope, key) =>
    key.split(".").reduce((acc, part) => (acc === null || acc === undefined ? undefined : acc[part]), scope);

// Field thiếu trong DATA -> để trống (thay vì in ra "undefined" trên báo cáo).
const fillText = (text, scope) =>
    text.replace(PLACEHOLDER_PATTERN, (match, key) => {
        const value = getValue(scope, key);
        return value === undefined || value === null ? "" : String(value);
    });

// Text hiển thị của ô, để dò placeholder/marker (bỏ qua ô số, ngày, công thức).
const cellText = (cell) => {
    const value = cell.value;
    if (typeof value === "string") return value;
    if (value && Array.isArray(value.richText)) return value.richText.map((run) => run.text).join("");
    return "";
};

// Áp `transform` lên phần text của ô, giữ nguyên kiểu giá trị của exceljs
// (string / richText / hyperlink / formula).
const mapCellText = (cell, transform) => {
    const value = cell.value;

    if (typeof value === "string") {
        const next = transform(value);
        if (next !== value) cell.value = next;
        return;
    }

    if (!value || typeof value !== "object" || value instanceof Date) return;

    if (Array.isArray(value.richText)) {
        // Excel tách 1 ô thành nhiều run khi định dạng khác nhau, có thể cắt
        // đôi placeholder ({VAL} -> "{VA" + "L}"). Dấu hiệu là run có số "{"
        // khác số "}" -> gộp cả ô về 1 run rồi mới thay.
        const isSplit = value.richText.some(
            (run) => (run.text.match(/\{/g) || []).length !== (run.text.match(/\}/g) || []).length
        );

        if (isSplit) {
            const joined = value.richText.map((run) => run.text).join("");
            cell.value = { richText: [{ font: value.richText[0].font, text: transform(joined) }] };
        } else {
            cell.value = { richText: value.richText.map((run) => ({ ...run, text: transform(run.text) })) };
        }
        return;
    }

    if (typeof value.hyperlink === "string") {
        cell.value = { ...value, text: transform(value.text || "") };
        return;
    }

    if (typeof value.formula === "string") {
        const formula = transform(value.formula);
        if (formula !== value.formula) cell.value = { formula }; // bỏ result cũ để Excel tính lại
    }
};

const renderCell = (cell, scope) => {
    const text = cellText(cell);
    const whole = text.match(WHOLE_PLACEHOLDER_PATTERN);

    if (whole) {
        const value = getValue(scope, whole[1]);
        // Ô chỉ chứa đúng 1 placeholder và dữ liệu là số/ngày/boolean thì ghi
        // đúng kiểu để Excel còn tính toán và áp numFmt của template.
        if (typeof value === "number" || typeof value === "boolean" || value instanceof Date) {
            cell.value = value;
            return;
        }
    }

    mapCellText(cell, (t) => fillText(t, scope));
};

const cloneCellValue = (value) =>
    value && typeof value === "object" && !(value instanceof Date) ? JSON.parse(JSON.stringify(value)) : value;

const copyRow = (src, dst) => {
    dst.style = src.style;
    dst.height = src.height;
    src.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const target = dst.getCell(colNumber);
        target.style = cell.style;
        target.value = cloneCellValue(cell.value);
    });
};

// Merge trực tiếp ở mức cell thay vì worksheet.mergeCells: sau khi chèn dòng,
// index worksheet._merges giữ toạ độ cũ nên mergeCells hay báo nhầm "Cannot
// merge already merged cells". Bộ ghi file của exceljs dựng lại danh sách
// merge từ chính các cell nên cách này vẫn ra file đúng.
const mergeCellsAt = (worksheet, top, left, bottom, right) => {
    const master = worksheet.getCell(top, left);
    for (let row = top; row <= bottom; row += 1) {
        for (let col = left; col <= right; col += 1) {
            if (row !== top || col !== left) worksheet.getCell(row, col).merge(master);
        }
    }
};

// Tìm block lặp còn marker đầu tiên trong sheet (không hỗ trợ block lồng nhau).
const findLoopBlock = (worksheet) => {
    let open = null;
    let block = null;

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (block) return;
        row.eachCell({ includeEmpty: false }, (cell) => {
            if (block) return;
            const text = cellText(cell);
            if (!text) return;

            const openMatch = text.match(LOOP_OPEN_PATTERN);
            if (openMatch && !open) open = { key: openMatch[1], start: rowNumber };

            const closeMatch = text.match(LOOP_CLOSE_PATTERN);
            if (closeMatch && open && closeMatch[1] === open.key) block = { ...open, end: rowNumber };
        });
    });

    return block;
};

// Nhân bản các block {#KEY}...{/KEY} theo số phần tử của DATA[KEY].
// Trả về map: số dòng -> scope dữ liệu của dòng đó (dòng ngoài block không có
// trong map và sẽ render bằng DATA gốc).
const expandLoops = (worksheet, data) => {
    const rowScopes = new Map();

    for (let guard = 0; guard < MAX_LOOP_BLOCKS; guard += 1) {
        const block = findLoopBlock(worksheet);
        if (!block) break;

        const { key, start, end } = block;
        const blockSize = end - start + 1;
        const raw = getValue(data, key);
        // Không có dữ liệu -> vẫn giữ khung 1 dòng với placeholder rỗng, không
        // xoá dòng (xoá dòng làm lệch merge của phần bên dưới template).
        const items = Array.isArray(raw) && raw.length ? raw : [{}];

        // Xoá marker ngay trên dòng gốc: bản sao sạch marker và vòng while
        // không quét lại đúng block này.
        for (let row = start; row <= end; row += 1) {
            worksheet.getRow(row).eachCell({ includeEmpty: false }, (cell) => {
                mapCellText(cell, (text) => text.replace(LOOP_MARKER_PATTERN, ""));
            });
        }

        // Chụp merge nội bộ block (toạ độ tương đối) trước khi chèn dòng.
        const blockMerges = Object.values(worksheet._merges || {})
            .filter((merge) => merge.top >= start && merge.bottom <= end)
            .map((merge) => ({
                top: merge.top - start,
                left: merge.left,
                bottom: merge.bottom - start,
                right: merge.right
            }));

        const copies = items.length - 1;
        if (copies > 0) {
            const inserted = blockSize * copies;
            worksheet.spliceRows(end + 1, 0, ...new Array(inserted).fill([]));

            for (let i = 0; i < inserted; i += 1) {
                copyRow(worksheet.getRow(start + (i % blockSize)), worksheet.getRow(end + 1 + i));
            }

            for (let copy = 1; copy <= copies; copy += 1) {
                const offset = copy * blockSize;
                blockMerges.forEach((merge) => {
                    mergeCellsAt(
                        worksheet,
                        start + offset + merge.top,
                        merge.left,
                        start + offset + merge.bottom,
                        merge.right
                    );
                });
            }
        }

        items.forEach((item, index) => {
            const fields = item && typeof item === "object" && !Array.isArray(item) ? item : { _VALUE: item };
            const scope = { ...data, ...fields, _INDEX: index + 1 };
            for (let row = 0; row < blockSize; row += 1) {
                rowScopes.set(start + index * blockSize + row, scope);
            }
        });
    }

    return rowScopes;
};

const renderWorksheet = (worksheet, data) => {
    const rowScopes = expandLoops(worksheet, data);

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        const scope = rowScopes.get(rowNumber) || data;
        row.eachCell({ includeEmpty: false }, (cell) => renderCell(cell, scope));
    });

    const headerFooter = worksheet.headerFooter;
    if (headerFooter) {
        ["oddHeader", "oddFooter", "evenHeader", "evenFooter", "firstHeader", "firstFooter"].forEach((field) => {
            if (typeof headerFooter[field] === "string") {
                headerFooter[field] = fillText(headerFooter[field], data);
            }
        });
    }
};

// Generate file Excel từ template `${MABC}.xlsx` trong controllers/LDS/templates/.
// Cùng kiểu input/response với generateDocxFromTemplate (bản .docx): body
// { DATA: { MABC, VAL01, VAL02, ..., ITEMS: [...] } }, trả về file nhị phân.
module.exports.generateXlsxFromTemplate = async (req, res) => {
    const { data, maBc, error, templatePath } = parseRequest(req, "xlsx");

    if (error) {
        return res.status(400).json({ success: false, message: error });
    }

    if (!fs.existsSync(templatePath)) {
        return res.status(400).json({ success: false, message: `Không tìm thấy template cho MABC: ${maBc}` });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        workbook.eachSheet((worksheet) => renderWorksheet(worksheet, data));

        const buffer = await workbook.xlsx.writeBuffer();
        const fileName = `${maBc}_${Date.now()}.xlsx`;

        res.setHeader("Content-Type", CONTENT_TYPES.xlsx);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ success: false, message: "Không thể tạo file Excel từ template", details: error.message });
    }
};

// Lưu/ghi đè file template vào controllers/LDS/templates/ để
// generateDocxFromTemplate / generateXlsxFromTemplate tra cứu sau này. Nhận file
// dạng base64 trong JSON body (giống ZFM_DHN_FILE_BASE64) thay vì multipart,
// cho khớp cách LIMS/SAP gọi API hiện tại. Tên file ép theo MABC + đuôi lấy từ
// request (MABC "BIDV_03.xlsx" / FILE_NAME / FILE_TYPE) chứ không dùng
// originalname, và validate bằng MABC_PATTERN để chặn path traversal.
module.exports.saveTemplate = async (req, res) => {
    const { data, error, fileName, templatePath, ext } = parseRequest(req);

    if (error) {
        return res.status(400).json({ success: false, message: error });
    }

    const fileBase64 = data.FILE_BASE64 || "";
    if (!fileBase64) {
        return res.status(400).json({ success: false, message: "Thiếu tham số FILE_BASE64" });
    }

    let buffer;
    try {
        buffer = Buffer.from(fileBase64, "base64");
        new PizZip(buffer); // .docx/.xlsx thực chất là zip — mở thử để chặn payload hỏng/không hợp lệ trước khi ghi đĩa
    } catch (error) {
        return res.status(400).json({ success: false, message: `FILE_BASE64 không phải file .${ext} hợp lệ` });
    }

    try {
        fs.writeFileSync(templatePath, buffer);
        res.json({ success: true, message: "Lưu template thành công!", fileName });
    } catch (error) {
        res.status(500).json({ success: false, message: "Không thể lưu template", details: error.message });
    }
};

// Tải nguyên file template (chưa render DATA) theo MABC + FILE_TYPE — khác
// generateDocxFromTemplate ở chỗ không map placeholder, chỉ trả lại đúng file
// gốc đang lưu trong controllers/LDS/templates/. Trả JSON base64 (field
// `base64` giống getFileDHN/getDhnFileModel) thay vì binary, để hệ thống
// khác (SAP...) nhận qua JSON dùng chung một kiểu response.
module.exports.downloadTemplate = async (req, res) => {
    const { maBc, error, fileName, templatePath } = parseRequest(req);

    if (error) {
        return res.status(400).json({ success: false, message: error });
    }

    if (!fs.existsSync(templatePath)) {
        return res.status(400).json({ success: false, message: `Không tìm thấy template cho MABC: ${maBc}` });
    }

    try {
        const buffer = fs.readFileSync(templatePath);
        res.json({ success: true, fileName, base64: buffer.toString("base64") });
    } catch (error) {
        res.status(500).json({ success: false, message: "Không thể đọc template", details: error.message });
    }
};
