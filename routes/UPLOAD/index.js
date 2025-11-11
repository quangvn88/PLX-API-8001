const express = require("express");
const router = express.Router();
const upload = require("../../config/multer");

router.post("/", upload.single("image"), (req, res) => {
  console.log("File upload request received.");
  if (!req.file) {
    return res.status(400).json({ message: "Không có file được upload!" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    message: "Upload thành công!",
    fileUrl,
  });
});

module.exports = router;
