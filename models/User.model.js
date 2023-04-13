const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  server: String,
  username: String,
  password: String,
  token: String, //JWT
  infoDevice: String
});

// Collection inside the database
module.exports = mongoose.model("User", UserSchema);
