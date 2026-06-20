const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100, // giới hạn số lượng request
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." },
});
