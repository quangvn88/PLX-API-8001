const axios = require('axios');
const { Readable } = require('stream');
const ExcelJS = require('exceljs');
const fs = require('fs')
const contentDisposition = require('content-disposition');

const downloadFileBI = async (req, res) => {
    const fileName = req.query.file || "";

    if (!fileName) {
        res.status(400).send('File path is required')
        return;
    }

    let data = JSON.stringify({
        "I_FILE": fileName
    });

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://sap.petrolimex.com.vn:8001/sap/plx/ZFM_READ_AL11',
        data: data,
        auth: {
            username: process.env.SAP_PRD_USER,
            password: process.env.SAP_PRD_PASS,
        },
    };

    axios.request(config)
        .then((response) => {
            const data = response.data;

            if (data?.ES_RETURN?.TYPE !== 'S' || !data) {
                res.status(400).send('Error' + data?.ES_RETURN?.MESSAGE || '')
                return;
            }

            const ET_RCGREPFILE = data.ET_RCGREPFILE
            const hexData = ET_RCGREPFILE.map(obj => obj.ORBLK.slice(2)).join("")
            const bufferData = Buffer.from(hexData, 'hex');

            try {
                res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);

            } catch (error) {

            }

            if (fileName.includes('.xlsx')) {
                // Specify the output file path
                const outputPath = __dirname + Date.now() + fileName // Update the filename and extension as needed
                // Create a new workbook
                const workbook = new ExcelJS.Workbook();

                // Load data from the buffer
                workbook.xlsx.load(bufferData)
                    .then(() => {
                        // Write the loaded data to a file
                        workbook.xlsx.writeFile(outputPath)
                            .then(() => {
                                console.log('Data from buffer written to Excel file:', outputPath);
                                //return
                                res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
                                res.setHeader('Content-Type', 'application/octet-stream');

                                // Read the file and send it as a response
                                const fileStream = fs.createReadStream(outputPath);
                                fileStream.pipe(res);

                                res.on('finish', () => {
                                    // After the response is sent to the client, you can delete the file
                                    fs.unlink(outputPath, (err) => {
                                        if (err) {
                                            console.error('Error deleting file:', err);
                                        } else {
                                            console.log('File deleted successfully.');
                                        }
                                    });
                                });

                            })
                            .catch((error) => {
                                res.status(500)
                                console.error('Error:', error);
                            });
                    })
                    .catch((error) => {
                        res.status(500)
                        console.error('Error:', error);
                    });
            } else if (fileName.includes('.pdf')) {
                // Thiết lập tiêu đề và định dạng tệp PDF
                res.setHeader('Content-Type', 'application/pdf');
                // res.end(bufferData)
                // Tạo một luồng đọc từ dữ liệu hex
                const hexStream = new Readable();
                hexStream.push(bufferData);
                hexStream.push(null); // Kết thúc luồng

                // Pipe luồng hex vào phản hồi của máy khách
                hexStream.pipe(res);
            } else {
                res.end(bufferData)
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send('Something Error')
        });
}

module.exports = { downloadFileBI }