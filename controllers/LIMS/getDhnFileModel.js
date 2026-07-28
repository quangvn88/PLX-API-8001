const ExcelJS = require("exceljs");
const moment = require("moment");
const ssf = require("ssf");
const { getFileDHN } = require("./serveDhnFilePublic");

// ---------------------------------------------------------------------------
// Đọc file .xlsx (buffer) -> JSON model (giá trị + style + gộp ô + conditional
// formatting) để client tự render lại giống Excel. Port từ
// D:\DATA\NodeJS\Excel\server\index.js (hàm parseWorkbook) — giữ nguyên logic,
// chỉ đổi nguồn buffer sang lấy từ SAP base64 (getFileDHN) thay vì đọc file local.
// ---------------------------------------------------------------------------
const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const argbColor = (c) => {
    if (!c) return null;
    if (c.argb) {
        const a = c.argb;
        return '#' + (a.length === 8 ? a.slice(2) : a);
    }
    return null;
};

const colLetterToNum = (s) => {
    let n = 0;
    for (const ch of s) n = n * 26 + (ch.charCodeAt(0) - 64);
    return n;
};

const parseRange = (r) => {
    const m = String(r).match(/([A-Z]+)(\d+):([A-Z]+)(\d+)/);
    if (!m) return null;
    return { c1: colLetterToNum(m[1]), r1: +m[2], c2: colLetterToNum(m[3]), r2: +m[4] };
};

const rawCellValue = (cell) => {
    if (!cell || cell.value == null) return '';
    const v = cell.value;
    if (typeof v === 'object') {
        if (v.richText) return v.richText.map((t) => t.text).join('');
        if (v.text != null) return v.text;
        if (v.result != null) return String(v.result);
        return '';
    }
    return String(v);
};

const parseWorkbookToModel = async (buffer) => {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer);
    const sheets = [];

    wb.eachSheet((ws) => {
        // gộp ô
        const merges = (ws.model && ws.model.merges) || [];
        const master = {}, covered = {};
        merges.forEach((rng) => {
            const p = parseRange(rng);
            if (!p) return;
            master[p.r1 + '_' + p.c1] = { rs: p.r2 - p.r1 + 1, cs: p.c2 - p.c1 + 1 };
            for (let r = p.r1; r <= p.r2; r++) {
                for (let c = p.c1; c <= p.c2; c++) {
                    if (!(r === p.r1 && c === p.c1)) covered[r + '_' + c] = 1;
                }
            }
        });

        // conditional formatting kiểu biểu thức $COL{row}="value"
        const cfRules = [];
        (ws.conditionalFormattings || []).forEach((g) => {
            const refs = String(g.ref || '').split(/\s+/).map(parseRange).filter(Boolean);
            if (!refs.length) return;
            (g.rules || []).forEach((rule) => {
                if (rule.type !== 'expression' || !rule.formulae || !rule.formulae[0]) return;
                const mm = String(rule.formulae[0]).match(/^\$([A-Z]+)(\d+)\s*=\s*"(.*)"$/);
                if (!mm) return;
                const st = rule.style || {};
                let css = '';
                if (st.font) {
                    if (st.font.bold) css += 'font-weight:600;';
                    if (st.font.italic) css += 'font-style:italic;';
                    const fc = st.font.color && st.font.color.argb ? ('#' + st.font.color.argb.slice(2)) : null;
                    if (fc) css += 'color:' + fc + ';';
                }
                if (st.fill && st.fill.pattern !== 'none' && st.fill.bgColor && st.fill.bgColor.argb) {
                    css += 'background:#' + st.fill.bgColor.argb.slice(2) + ';';
                }
                if (!css) return;
                cfRules.push({ refs, markerCol: colLetterToNum(mm[1]), anchorRow: +mm[2], value: mm[3], css });
            });
        });

        const cfFor = (r, c) => {
            let out = '';
            for (const rl of cfRules) {
                let fr = null;
                for (const rf of rl.refs) {
                    if (c >= rf.c1 && c <= rf.c2 && r >= rf.r1 && r <= rf.r2) { fr = rf.r1; break; }
                }
                if (fr === null) continue;
                const refRow = rl.anchorRow + (r - fr);
                const mv = rawCellValue(ws.getRow(refRow).getCell(rl.markerCol));
                if (String(mv).trim() === rl.value) out += rl.css;
            }
            return out;
        };

        const colCount = ws.columnCount || 0;
        const rowCount = ws.rowCount || 0;
        const cols = [];
        for (let c = 1; c <= colCount; c++) {
            const w = ws.getColumn(c).width;
            cols.push(w ? Math.round(w * 7) + 5 : 64);
        }

        const rows = [];
        for (let r = 1; r <= rowCount; r++) {
            const row = ws.getRow(r);
            const h = row.height ? Math.round(row.height * 4 / 3) : 20;
            const cells = [];
            for (let c = 1; c <= colCount; c++) {
                if (covered[r + '_' + c]) continue;
                const cell = row.getCell(c);
                const st = cell.style || {};
                const hidden = cell.numFmt && String(cell.numFmt).replace(/ /g, '') === ';;;';

                let text = '';
                if (!hidden) {
                    try {
                        const rawValue = cell.value;
                        if (rawValue instanceof Date) {
                            // cell.text không tự format Date theo numFmt (trả về
                            // Date.toString() thô) nên phải tự format bằng moment.
                            const fmt = String(cell.numFmt || '').toLowerCase();
                            const hasTime = /h|:|am\/pm/.test(fmt);
                            text = moment(rawValue).format(hasTime ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY');
                        } else {
                            // cell.text cũng không tự format số theo numFmt (ví dụ
                            // "#,##0.00", "0%") — trả về số thô, nên dùng ssf (cùng
                            // engine format số mà SheetJS dùng) để format đúng.
                            const numericValue = typeof rawValue === 'number'
                                ? rawValue
                                : (rawValue && typeof rawValue === 'object' && typeof rawValue.result === 'number'
                                    ? rawValue.result
                                    : null);
                            if (numericValue !== null && cell.numFmt && cell.numFmt !== 'General') {
                                text = ssf.format(cell.numFmt, numericValue);
                            } else {
                                text = cell.text != null && cell.text !== '' ? cell.text : rawCellValue(cell);
                            }
                        }
                    } catch (e) {
                        text = cell.text != null && cell.text !== '' ? cell.text : rawCellValue(cell);
                    }
                    if (text && typeof text === 'object') text = '';
                }
                text = esc(text).replace(/\n/g, '<br>');

                let s = '';
                const f = st.font || {};
                if (f.bold) s += 'font-weight:600;';
                if (f.italic) s += 'font-style:italic;';
                if (f.underline) s += 'text-decoration:underline;';
                if (f.size) s += 'font-size:' + Math.round(f.size * 4 / 3) + 'px;';
                if (f.name) s += "font-family:'" + f.name + "',Arial,sans-serif;";
                const fc = argbColor(f.color);
                if (fc) s += 'color:' + fc + ';';
                if (st.fill && st.fill.type === 'pattern') {
                    const bg = argbColor(st.fill.fgColor);
                    if (bg) s += 'background:' + bg + ';';
                }
                const al = st.alignment || {};
                if (al.horizontal) s += 'text-align:' + al.horizontal + ';';
                else if (typeof cell.value === 'number') s += 'text-align:right;';
                if (al.vertical) s += 'vertical-align:' + (al.vertical === 'middle' ? 'middle' : al.vertical) + ';';
                if (al.wrapText) s += 'white-space:normal;';

                const bd = st.border || {};
                const buildBorderSide = (e) => {
                    if (!e || !e.style) return null;
                    const col = argbColor(e.color) || '#000';
                    const w = (e.style === 'thick' || e.style === 'medium') ? '2px' : '1px';
                    const ty = e.style === 'dotted' ? 'dotted' : (e.style === 'dashed' ? 'dashed' : 'solid');
                    return w + ' ' + ty + ' ' + col;
                };
                const bt = buildBorderSide(bd.top), bl = buildBorderSide(bd.left);
                const bb = buildBorderSide(bd.bottom), br = buildBorderSide(bd.right);
                if (bt) s += 'border-top:' + bt + ';';
                if (bl) s += 'border-left:' + bl + ';';
                if (bb) s += 'border-bottom:' + bb + ';';
                if (br) s += 'border-right:' + br + ';';
                s += cfFor(r, c);

                const mg = master[r + '_' + c];
                cells.push({ r, c, rowspan: mg ? mg.rs : 1, colspan: mg ? mg.cs : 1, text, css: s });
            }
            rows.push({ h, cells });
        }
        sheets.push({ name: ws.name, colCount, cols, rows });
    });

    return { sheets };
};

// FUNC ZFM_DHN_FILE_BASE64 phía LIMS: lấy file DHN từ SAP rồi trả JSON model
// (giống app.get('/api/view-default') ở D:\DATA\NodeJS\Excel\server) để client
// tự render lại lưới Excel (đủ style/merge/conditional formatting) — khác với
// nhánh MOBILE (DHN.controller/downloadFileDHN) trả sẵn HTML.
const getDhnFileModel = async (req, res) => {
    const server = req.params.server || "";
    const date = req.body.date || "";

    if (!date) {
        return res.status(400).json({ success: false, msg: "Thiếu tham số date" });
    }

    const result = await getFileDHN(server, date);

    if (!result.success || !result.base64) {
        return res.status(500).json(result);
    }

    try {
        const buffer = Buffer.from(result.base64, "base64");
        const model = await parseWorkbookToModel(buffer);
        res.json({ success: true, sheets: model.sheets });
    } catch (err) {
        console.error("getDhnFileModel parse error:", err.message);
        res.status(500).json({ success: false, msg: "Không thể đọc file excel" });
    }
};

module.exports = { getDhnFileModel, parseWorkbookToModel };
