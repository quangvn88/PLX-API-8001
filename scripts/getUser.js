const { deCrypto } = require("./crypto");
const UserSchema = require("../models/User.model");

module.exports.getUser = async (decoded) => {
  const user = await UserSchema.findOne({
    username: decoded.username,
    server: decoded.server,
    token: decoded.token,
  });

  if (user) {
    const passwordDecrypted = deCrypto(user.password);
    return {
      success: true,
      username: user.username,
      password: passwordDecrypted,
      // twoFA: user.twoFA,
    };
  } else {
    return { success: false };
  }
};
