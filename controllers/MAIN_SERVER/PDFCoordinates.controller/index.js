const PDFExtract = require('pdf.js-extract').PDFExtract;
const pdfExtract = new PDFExtract();
const fs = require('fs');
// const buffer = fs.readFileSync("smart.pdf");
const options = {}; /* see below */

// const { PDFDocument, StandardFonts, rgb } = require('pdf-lib')

const extractCoordinatesPDF = async (req, res) => {
    const pdfHex = req.body.pdfHex || '';
    const searchText = req.body.searchText || '';

    if (!pdfHex || !searchText) {
        res.sendStatus(400)
        return;
    }

    let bufferData = '';
    try {
        bufferData = Buffer.from(pdfHex, 'hex');
    } catch (error) {
        res.sendStatus(400)
        return;
    }


    pdfExtract.extractBuffer(bufferData, options, (err, data) => {
        if (err) {
            res.sendStatus(400)

            return console.log(err);
        }

        const pagesLength = data.pages.length;
        const lastPage = data.pages[pagesLength - 1]
        const { width, height } = lastPage.pageInfo

        const sign = lastPage.content.find(character => character.str === searchText);
        // console.log(sign);
        const signX = sign.x;
        const signY = height - sign.y;

        res.json({
            data: {
                signX,
                signY
            }
        })

        // console.log(signX)
        // createPdf(buffer)
    });
}

module.exports = { extractCoordinatesPDF }



