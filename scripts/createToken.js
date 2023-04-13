require("dotenv/config");
const jwt = require("jsonwebtoken");

const rand = () => {
  return Math.random().toString(36).substr(2); // remove `0.`
};
const randomToken = () => {
  return rand() + rand() + rand() + rand();
};

module.exports.genToken = (username, server) => {
  const token = randomToken();
  const user = { username: username, server: server, token: token };
  const privateKey = process.env.KEY_JWT;
  const jwtToken = jwt.sign(user, privateKey);
  return {
    jwt: jwtToken,
    token: token,
  };
};
