const Jimp = require("jimp");
const bwipjs = require("bwip-js");

const generateBarCode = async (req, res) => {
    console.log("Generating barcode...");
    const data = req.query.data || "123456";
    const width = parseInt(req.query.width || "300", 10);
    const height = parseInt(req.query.height || "100", 10);
    const borderSize = 5; // số pixel viền trắng

    try {
        // Tạo ảnh barcode (PNG buffer mặc định, không cần BMP ở bước này)
        const barcodeBuffer = await bwipjs.toBuffer({
            bcid:        'code128',
            text:        data,
            scale:       3,
            width:       width,
            height:      height,
            includetext: true,
            textxalign:  'center',
            textsize:    6,          
            backgroundcolor: 'FFFFFF'
        });

        // Đọc buffer bằng Jimp
        const barcodeImage = await Jimp.read(barcodeBuffer);

        // Tạo ảnh nền trắng có border
        const borderedImage = new Jimp(
            barcodeImage.bitmap.width + borderSize * 2,
            barcodeImage.bitmap.height + borderSize * 2,
            0xFFFFFFFF // màu trắng
        );

        // Dán barcode vào giữa ảnh nền trắng
        borderedImage.composite(barcodeImage, borderSize, borderSize);

        // Xuất BMP buffer
        const finalBuffer = await borderedImage.getBufferAsync(Jimp.MIME_BMP);

        res.set("Content-Type", "image/bmp");
        res.send(finalBuffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating barcode" });
    }
};

module.exports = { generateBarCode };
