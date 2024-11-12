const path = require("path");
const mime = require("mime");
const fs = require("fs");

module.exports.downloadApp = (req, res) => {
  let fileName = "PetroMobile.apk"
  const version = req.params.version ?? "";

  switch (version) {
    case 'UAT':
      fileName = "PetroMobileUAT.apk"
    default:
      break;
  }
  try {
    const file = `public/download/android/${fileName}`;
    res.download(file);
    // const filename = path.basename(file);
    // const mimetype = mime.lookup(file);

    // res.setHeader("Content-disposition", "attachment; filename=" + filename);
    // res.setHeader("Content-type", mimetype);

    // const filestream = fs.createReadStream(file);
    // filestream.pipe(res);
  } catch (err) {
    res.send("Tải xuống thất bại, Vui lòng thử lại");
  }
};
