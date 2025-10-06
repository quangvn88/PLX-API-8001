const APILogModel = require("../models/APILog.model");
const { EXCLUDED_FUNCS_FROM_LOG } = require('./config');

module.exports.writeLogAPI = async (req, res, next) => {  
  const now = new Date();
  // Format ngày YYYY-MM-DD
  const dateStr = now.toISOString().slice(0, 10); // "2025-07-22"
  // Format giờ HH:MM:SS
  const timeStr = now.toTimeString().slice(0, 8); // "14:30:05"
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.headers['x-forwarded-for']);

  const reqData = {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers,
    query: req.query,
    body: req.body,
    bodyAsString: JSON.stringify(req.body),
    date: dateStr,
    time: timeStr,
    ip: ip,
    createdAt: now
  };

  const originalSend = res.send;
  res.send = async function (body) {
    try {
      if (!EXCLUDED_FUNCS_FROM_LOG.includes(req.body?.FUNC)) {
        const log = new APILogModel({
          ...reqData,
          statusCode: res.statusCode,
          category: req.body?.DATA?.CATEGORY_TYPE,
          responseBody: body          
        });

        await log.save();
      }
    } catch (err) {
      console.error("Error saving API log:", err);
    }

    return originalSend.call(this, body);
  };

  next();
};
