const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const TEMPLATES_DIR = path.join(__dirname, "templates");

// Đăng ký template dùng chung ở đây — thêm template mới (vd HDMBNT2, ...) chỉ
// cần thêm 1 dòng, không cần sửa logic render bên dưới. Key là DATA.MABC
// client gửi lên, value là tên file .docx trong controllers/LDS/templates/.
const TEMPLATE_MAP = {
    AGR_06: "AGR_06.docx",
};

// Generate văn bản dùng chung cho nhiều loại template: input là DATA.MABC
// (chọn file .docx trong TEMPLATE_MAP) + các field VAL01, VAL02, ... trong
// cùng DATA, map thẳng vào placeholder {VAL01}, {VAL02}, ... trong template.
module.exports.generateFromTemplate = async (req, res) => {
    const body = req.body || {};
    const data = body.DATA || {};
    const maBc = data.MABC || "";

    if (!maBc) {
        return res.status(400).json({ success: false, message: "Thiếu tham số MABC" });
    }

    const templateFile = TEMPLATE_MAP[maBc];
    if (!templateFile) {
        return res.status(400).json({ success: false, message: `MABC không hợp lệ: ${maBc}` });
    }

    try {
        const templatePath = path.join(TEMPLATES_DIR, templateFile);
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, { linebreaks: true });
        doc.render(data);

        const buffer = doc.getZip().generate({ type: "nodebuffer" });
        const fileName = `${maBc}_${Date.now()}.docx`;

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.send(buffer);
    } catch (error) {
        const details = error.properties?.errors?.map((e) => e.properties?.explanation) || error.message;
        res.status(500).json({ success: false, message: "Không thể tạo văn bản từ template", details });
    }
};
