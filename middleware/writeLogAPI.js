const APILogModel = require("../models/APILog.model");
const { EXCLUDED_FUNCS_FROM_LOG } = require('./config');

module.exports.writeLogAPI = async (req, res, next) => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10);
  const timeStr = now.toTimeString().slice(0, 8);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const reqData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    bodyAsString: JSON.stringify(req.body),
    date: dateStr,
    time: timeStr,
    ip,
    createAt: now
  };

  const originalSend = res.send;

  res.send = async function (body) {
    try {
		// 🧩 Nếu response là Buffer (ảnh, file, PDF, ...) → bỏ qua log để tránh lỗi
		if (Buffer.isBuffer(body) || res.getHeader('Content-Type')?.startsWith('image/')) {
			return originalSend.call(this, body);
			}
      	let responseData = body;

		// Nếu là chuỗi JSON → parse ra object
		if (typeof body === "string") {
			try {
			responseData = JSON.parse(body);
			} catch {
			responseData = body;
			}
		}

      if (!EXCLUDED_FUNCS_FROM_LOG.includes(req.body?.FUNC)) {
        const log = new APILogModel({
          ...reqData,
          statusCode: res.statusCode,
          responseBody: responseData
        });

        const savedLog = await log.save();

        // ✅ Thêm _logId vào dữ liệu trả về mà không xoá gì cả
        if (typeof responseData === "object" && responseData !== null) {
          responseData = { ...responseData, LOGID: savedLog._id };
        }
      }

      // ✅ Nếu là object → trả JSON
      if (typeof responseData === "object") {
        return originalSend.call(this, JSON.stringify(responseData));
      }

      // ✅ Nếu không phải JSON (ví dụ text, HTML) → trả như cũ
      return originalSend.call(this, responseData);

    } catch (err) {
      console.error("Error saving API log:", err);
      return originalSend.call(this, body);
    }
  };

  next();
};
