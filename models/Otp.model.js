const mongoose = require("mongoose");

const OtpSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    code: String,
    token: String,
  },
  { timestamps: true }
);
OtpSchema.index({ createdAt: 1 }, { expires: "5m" });

// Collection inside the database
module.exports = mongoose.model("Otp", OtpSchema);
