const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const login = (req, res) => {
  const server = req.params.server || "";  // "dev" hoặc "prd"
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ message: "Thiếu Basic Auth" });
  }

  // giải mã base64
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [user, password] = credentials.split(":");

  let validUser, validPassword;

  if (server.toLowerCase() === "dev") {
    validUser = process.env.ADMIN_USER_DEV;
    validPassword = process.env.ADMIN_PASSWORD_DEV;
  } else if (server.toLowerCase() === "prd") {
    validUser = process.env.ADMIN_USER_PRD;
    validPassword = process.env.ADMIN_PASSWORD_PRD;
  } else {
    return res.status(400).json({ message: "Server không hợp lệ (chỉ dev hoặc prd)" });
  }

  // check user/pass
  if (user !== validUser || password !== validPassword) {
    return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
  }

  // tạo token
  const token = jwt.sign(
    { id: 1, user: validUser, role: server.toLowerCase() }, // role = dev hoặc prd
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({ token, server });
};

module.exports = { login };
