const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
const publicPaths = ["/login", "/signup"]; // route public

const authMiddleware = (req, res, next) => {
  if (publicPaths.includes(req.path)) {
    return next(); // bỏ qua kiểm tra token cho login/signup
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer xxx"
  if (!token) return res.status(401).json({ message: "Thiếu token" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token không hợp lệ" });
    req.user = user;
    next();
  });
};

module.exports = { authMiddleware };
