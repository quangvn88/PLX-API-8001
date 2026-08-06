const { execFile } = require("child_process");
const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const crypto = require("crypto");

// Đường dẫn tới binary LibreOffice — có thể override bằng biến môi trường
// LIBREOFFICE_PATH nếu cài ở vị trí khác với mặc định.
const SOFFICE_PATH =
    process.env.LIBREOFFICE_PATH ||
    (process.platform === "win32"
        ? "C:\\Program Files\\LibreOffice\\program\\soffice.exe"
        : "soffice");

const CONVERT_TIMEOUT_MS = 60 * 1000;

// Convert 1 buffer file văn phòng (xlsx, docx, ...) sang PDF bằng LibreOffice
// headless. Chạy soffice như 1 tiến trình con, dùng thư mục temp riêng cho mỗi
// lần convert để tránh đụng độ khi nhiều request chạy song song.
module.exports.convertBufferToPdf = async (buffer, sourceExt) => {
    const workDir = path.join(os.tmpdir(), `convert-${crypto.randomBytes(8).toString("hex")}`);
    await fs.mkdir(workDir, { recursive: true });

    const inputPath = path.join(workDir, `source.${sourceExt}`);
    const outputPath = path.join(workDir, "source.pdf");

    try {
        await fs.writeFile(inputPath, buffer);

        await new Promise((resolve, reject) => {
            execFile(
                SOFFICE_PATH,
                ["--headless", "--convert-to", "pdf", "--outdir", workDir, inputPath],
                { timeout: CONVERT_TIMEOUT_MS },
                (error, stdout, stderr) => {
                    if (error) return reject(new Error(stderr?.toString() || error.message));
                    resolve();
                }
            );
        });

        return await fs.readFile(outputPath);
    } finally {
        await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
};
