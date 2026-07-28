const fs = require("fs");
const path = require("path");
const Jimp = require("jimp"); // thuần JS, tương thích Node 16 (không cần binary native)

// Thư mục đích: public/bi (được express.static phục vụ tại /bi)
const BI_DIR = path.join(__dirname, "..", "..", "public", "bi");

// Giới hạn dung lượng ảnh sau khi nén
const TARGET_BYTES = 200 * 1024; // 200KB
const MAX_DIM = 1920; // cạnh lớn nhất ban đầu (px)

// Nén ảnh xuống <= targetBytes: giảm dần chất lượng JPEG, nếu vẫn lớn thì thu nhỏ kích thước.
// Luôn xuất JPEG (nén tốt). Trả về bản nhỏ nhất tìm được nếu không đạt ngưỡng.
const compressImage = async (buf, targetBytes = TARGET_BYTES) => {
  const image = await Jimp.read(buf);
  const baseWidth = Math.min(image.bitmap.width || MAX_DIM, MAX_DIM);

  let best = null;
  for (let scale = 1; scale >= 0.3; scale -= 0.15) {
    const width = Math.max(1, Math.round(baseWidth * scale));
    for (const quality of [80, 70, 60, 50, 40, 30]) {
      const out = await image
        .clone()
        .resize(width, Jimp.AUTO)
        .quality(quality)
        .getBufferAsync(Jimp.MIME_JPEG);
      if (!best || out.length < best.length) best = out;
      if (out.length <= targetBytes) return out;
    }
  }
  return best; // không đạt mục tiêu -> trả bản nhỏ nhất
};

// Suy ra phần mở rộng từ magic bytes của buffer
const extByMagic = (buf) => {
  const hex = buf.slice(0, 8).toString("hex");
  if (hex.startsWith("89504e47")) return "png";
  if (hex.startsWith("ffd8ff")) return "jpg";
  if (hex.startsWith("47494638")) return "gif";
  if (hex.startsWith("424d")) return "bmp";
  if (hex.startsWith("25504446")) return "pdf";
  return "bin";
};

// Hỗ trợ data URI, chuỗi nhiều dòng hoặc mảng; gom lại và bỏ khoảng trắng/xuống dòng.
const extractBase64 = (t) => {
  if (!t) return "";
  let raw = "";
  if (typeof t === "string") {
    raw = t;
  } else if (Array.isArray(t)) {
    raw = t
      .map((row) =>
        typeof row === "string"
          ? row
          : (row?.BASE64 ?? row?.E_BASE64 ?? Object.values(row || {})[0] ?? ""),
      )
      .join("");
  } else if (typeof t === "object") {
    raw = t.BASE64 ?? t.E_BASE64 ?? Object.values(t)[0] ?? "";
  }
  return String(raw)
    .replace(/^data:[^,]*,/, "")
    .replace(/\s/g, "");
};

// POST /bi/save-base64
// Body JSON: { BASE64: "<chuỗi base64 hoặc data URI>", FILENAME?: "ten-tuy-chon" }
const saveBase64 = async (req, res) => {
  try {
    const { BASE64, FILENAME } = req.body || {};

    // Gom & làm sạch chuỗi base64 (hỗ trợ data URI, mảng nhiều dòng từ SAP)
    const b64 = extractBase64(BASE64);
    if (!b64) {
      return res.status(400).json({ message: "Thiếu chuỗi base64!" });
    }

    const buf = Buffer.from(b64, "base64");
    if (!buf.length) {
      return res.status(400).json({ message: "Chuỗi base64 không hợp lệ!" });
    }

    let ext = extByMagic(buf);
    let outBuf = buf;

    // Ảnh raster -> luôn nén & xuất JPG cho nhẹ; file khác (pdf/bin) giữ nguyên
    const isRaster = ["png", "jpg", "gif", "bmp"].includes(ext);
    if (isRaster) {
      try {
        outBuf = await compressImage(buf, TARGET_BYTES);
        ext = "jpg"; // luôn là JPEG
      } catch (_) {
        outBuf = buf; // nén lỗi -> lưu ảnh gốc
      }
    }

    // Tên file: dùng tên truyền vào (bỏ phần mở rộng cũ) hoặc timestamp
    const safeBase = FILENAME
      ? path
          .basename(String(FILENAME))
          .replace(/\.[^.]+$/, "")
          .replace(/[^\w.-]/g, "_")
      : "img";
    const finalName = `${safeBase}.${ext}`;

    // Đảm bảo thư mục tồn tại rồi ghi file
    fs.mkdirSync(BI_DIR, { recursive: true });
    fs.writeFileSync(path.join(BI_DIR, finalName), outBuf);

    const fileUrl = `/bi/${finalName}`;
    return res.json({
      message: "Lưu ảnh thành công!",
      fileName: finalName,
      fileUrl,
      originalBytes: buf.length,
      bytes: outBuf.length,
      compressed: outBuf !== buf,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ message: "Lỗi khi lưu file", error: String(e) });
  }
};

module.exports = { saveBase64 };
