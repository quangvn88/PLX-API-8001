const Jimp = require("jimp");
const QRCode = require("qrcode");

function isNumber(n) {
    return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

const generateQRCode = async (req, res) => {
  const data = req.query.data || "";
  const width = parseInt(req.query.width) || 100;
  console.log("Generating QR code...", data, width);

  if (!data) {
    return res.status(400).json({ message: "data param is required" });
  }

  try {
    // Tạo QR code (buffer PNG)
    const qrCodeBuffer = await QRCode.toBuffer(data, {
      errorCorrectionLevel: "H",
      margin: 1, // giảm viền để QR nhỏ gọn hơn
    });

    // Đọc ảnh bằng Jimp
    const qrCodeImage = await Jimp.read(qrCodeBuffer);

    // Resize ảnh theo width yêu cầu (tự động scale chiều cao)
    qrCodeImage.resize(width, Jimp.AUTO);

    // Xuất ra BMP
    const bmpBuffer = await qrCodeImage.getBufferAsync(Jimp.MIME_BMP);

    res.set("Content-Type", "image/bmp");
    res.send(bmpBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error generating QR code" });
  }
};

const generateQRWithLogo = async (req, res) => {
    const data = req.query.data || "";
    const width = req.query.width || 100;

    if (!data) {
        res.status(500).json({ message: "data param is required" })
        return;
    }

    const qrData = data;
    const qrCodeOptions = {            
        errorCorrectionLevel: 'H',            
        width
    };
    
    try {
        // Tạo QR trước
        const qrBuffer = await QRCode.toBuffer(qrData, qrCodeOptions);

        // Đọc QR bằng Jimp
        const qrImage = await Jimp.read(qrBuffer);

        // Đọc logo
        const logo = await Jimp.read("public/logo/petro.png");
        const logoSize = Math.floor(width * 0.3); // 20% kích thước QR
        logo.resize(logoSize, Jimp.AUTO); // giữ tỉ lệ gốc, scale theo chiều ngang

        // Chèn logo vào giữa
        const x = (qrImage.bitmap.width / 2) - (logo.bitmap.width / 2);
        const y = (qrImage.bitmap.height / 2) - (logo.bitmap.height / 2);

        qrImage.composite(logo, x, y, {
            mode: Jimp.BLEND_SOURCE_OVER,
            opacitySource: 1,
            opacityDest: 1
        });

        // qrImage.autocrop({
        //     tolerance: 0,   // 0 = chính xác tuyệt đối
        //     cropOnlyFrames: false
        // });

        const bmpBuffer = await qrImage.getBufferAsync(Jimp.MIME_BMP);

        // Set the response content type to "image/bmp"
        res.set('Content-Type', 'image/bmp');
        res.send(bmpBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating QR code' });
    }
}

const generateQRCodeGoogleAPI = async (req, res) => {
    const chl = req.query.chl || "";
    const chs = req.query.chs || 100;

    const widthQR = isNumber(chs) ? chs : 100;

    var readError = false;

    const image = await Jimp.read({
        url: `https://chart.googleapis.com/chart?chs=${widthQR}x${widthQR}&cht=qr&chl=${encodeURIComponent(chl)}`,
        headers: {}
    }).catch((err) => {
        readError = true;
        res.status(500).json({ message: err.message || err })
    });

    if (readError) {
        return;
    }

    try {
        const width = image.bitmap.width;
        const height = image.bitmap.height;

        // Define the width of the border to remove (in pixels).
        // 200 / x = 30 -> width / 6
        const borderSize = widthQR / 6; // Adjust this value as needed.

        // Calculate the coordinates for cropping to remove the border.
        const left = borderSize;
        const top = borderSize;
        const right = width - borderSize;
        const bottom = height - borderSize;

        // Calculate the width and height of the cropped area.
        const newWidth = right - left;
        const newHeight = bottom - top;

        // Crop the image to remove the border.
        image.crop(left, top, newWidth, newHeight);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: err })
    }


    await image.getBuffer(Jimp.MIME_BMP, (err, result) => {
        if (err) {
            console.log(error)
            res.status(500).json({ message: err })
        } else {
            res.set('Content-Type', Jimp.MIME_BMP);
            res.status(200).send(result);
        }
    });

}

module.exports = { generateQRCode, generateQRCodeGoogleAPI, generateQRWithLogo }