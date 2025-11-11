const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    user: { type: String, required: true },
    text: { type: String, default: "" },
    image: { type: String, default: null },
    time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);