const jwt = require("jsonwebtoken");
const { checkToken, checkTokenOTP } = require("./checkToken");

module.exports.checkJWT = async (req, res, next) => {
  const server = req.params.server;
  const token = req.header("Authorization");
  if (token) {
    try {
      const privateKey = process.env.KEY_JWT;
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        privateKey,
        (err, decoded) => {
          return decoded;
        }
      );

      // Sai API
      if (server !== decoded.server) {
        res.status(403).json({
          msg: "No token provided.",
        });
      } else {
        // Check token
        const resCheck = await checkToken(decoded);

        if (resCheck) {
          // req data
          req.jwtDecoded = decoded;
          req.username = decoded.username;
          next();
        } else {
          res.status(401).json({
            msg: "Phiên đăng nhập đã hết hạn",
          });
        }
      }
    } catch (err) {
      res.status(401).json({
        msg: "Unauthorized.",
      });
    }
  } else {
    res.status(403).json({
      msg: "No token provided.",
    });
  }
};

module.exports.checkJWTOTP = async (req, res, next) => {
  const server = req.params.server;
  const otp = req.body.otp;
  const password = req.body.password;

  const token = req.header("Authorization");
  if (token) {
    try {
      const privateKey = process.env.KEY_JWT;
      const decoded = jwt.verify(
        token.replace("Bearer ", ""),
        privateKey,
        (err, decoded) => {
          return decoded;
        }
      );
      // Sai API
      if (server !== decoded.server) {
        res.status(403).json({
          msg: "No token provided.",
        });
      } else {
        // Check token
        const resCheck = await checkTokenOTP(decoded);
        if (resCheck.success) {
          // req data
          req.jwtDecoded = {
            ...decoded,
            correct: resCheck.otp === otp,
            password: password,
          };
          next();
        } else {
          res.status(401).json({
            msg: "Mã của bạn đã hết hạn, Vui lòng đăng nhập lại",
          });
        }
      }
    } catch (err) {
      res.status(401).json({
        msg: "Unauthorized.",
      });
    }
  } else {
    res.status(403).json({
      msg: "No token provided.",
    });
  }
};
