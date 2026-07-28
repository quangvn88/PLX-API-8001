const axios = require('axios');
const ExcelJS = require('exceljs');
const contentDisposition = require('content-disposition');

const { SAP_URL } = require('../../api/PLX_API');
const { getUserAuthSAP } = require('../../scripts/getUserAuthSAP');
const { convertBufferToPdf } = require('../../scripts/convertToPdf');

const FM_FILE = 'ZFM_DHN_FILE_BASE64';

// Ép mỗi sheet co vừa 1 trang theo chiều ngang (fitToWidth: 1) khi export PDF —
// tránh tình trạng bảng nhiều cột bị cắt vỡ sang nhiều trang. fitToHeight: 0
// nghĩa là không giới hạn số trang theo chiều dọc (nhiều dòng vẫn xuống trang
// tiếp theo bình thường, chỉ chiều ngang mới ép vừa 1 trang).
const fitExcelToPageWidth = async (buffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    workbook.eachSheet((sheet) => {
        sheet.pageSetup = {
            ...sheet.pageSetup,
            orientation: 'landscape',
            fitToPage: true,
            fitToWidth: 1,
            fitToHeight: 0,
        };
    });

    return workbook.xlsx.writeBuffer();
};

const getFileDHN = (server, date) => {
    const budat = date || '00000000';

    const url = SAP_URL(server, FM_FILE);
    const auth = getUserAuthSAP(server);

    let config = {
        method: 'get',
        url,
        auth,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            I_BUDAT: budat,
        },
    };
    console.log(budat);
    return axios.request(config)
        .then((response) => {
            const data = response.data;
            if (data.E_BASE64) {
                return {
                    success: true,
                    base64: data.E_BASE64,
                    budat,
                }
            } else {
                return {
                    success: false,
                    msg: "Không có dữ liệu file",
                };
            }
        })
        .catch((error) => {
            console.error('serveDhnFilePublic error:', error.response?.status, error.response?.data || error.message);
            return {
                success: false,
                msg: "Không thể kết nối tới hệ thống SAP",
            };
        });
};

// GET công khai (không Basic Auth, không token) — trình duyệt tự mở link này
// bằng server/date truyền thẳng qua query. Lấy file excel từ SAP rồi convert
// sang PDF bằng LibreOffice để trình duyệt render trực tiếp.
const serveDhnFilePublic = async function (req, res) {
    const server = req.query.server || '';
    const date = req.query.date || '';

    if (!server || !date) {
        return res.status(400).send('Thiếu tham số server hoặc date');
    }

    const result = await getFileDHN(server, date);

    if (!result.success || !result.base64) {
        return res.status(500).json(result);
    }

    try {
        const excelBuffer = Buffer.from(result.base64, 'base64');
        const fittedBuffer = await fitExcelToPageWidth(excelBuffer);
        const pdfBuffer = await convertBufferToPdf(fittedBuffer, 'xlsx');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            contentDisposition(`DHN_${result.budat}.pdf`, { type: 'inline' })
        );
        res.send(pdfBuffer);
    } catch (err) {
        console.error('convertBufferToPdf error:', err.message);
        res.status(500).json({ success: false, msg: "Không thể chuyển file sang PDF" });
    }
};

module.exports = { serveDhnFilePublic, getFileDHN };
