const axios = require("axios");
const moment = require("moment");
const ExcelJS = require("exceljs");

// API URL SERVER
const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");
const { getUserAuthSAP } = require("../../../../scripts/getUserAuthSAP");
const { excelWorksheetToHtml } = require("./excelWorksheetToHtml");

const { search } = require("./search");
const { confirm } = require("./confirm");

const FM_SEARCH = 'ZFM_DHN_GET'
const FM_CONFIRM = 'ZFM_DHN_CONFIRM'
const FM_FILE = 'ZFM_DHN_FILE_BASE64'

// Domain public của server này (giống hệt domain hardcode trong
// routes/MAIN_SERVER/View.route.js và REACT_APP_BASE_URL phía frontend) —
// dùng để dựng URL công khai mở trực tiếp trên trình duyệt (browser tự render
// PDF), KHÔNG dùng req.protocol/req.get('host') vì request có thể tới qua IP
// nội bộ.
const PUBLIC_BASE_URL = "https://erp.petrolimex.com.vn";

const getFileDHN = async ({ username, password, apiSAP, date }) => {
    let budat = '00000000';
    try {
        budat = moment(moment("" + date.replace(/\./g, ""), "DDMMYYYY")).format(
            "YYYYMMDD"
        );
    } catch (error) { }

    const data = {
        I_BUDAT: budat,
    };

    const result = await axios({
        method: "get",
        url: apiSAP,
        data: data,
        auth: {
            username: username,
            password: password,
        }
    })
        .then((res) => {
            const data = res.data;
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
        .catch((err) => {
            console.error("getFileDHN error:", err.response?.status, err.response?.data || err.message);
            const errCode = err.response?.status ? err.response.status : 500;
            return {
                success: false,
                msg: getMessageError(errCode),
            };
        });

    return result;
};

const getMessageError = (errCode) => {
    let msg = "Lỗi API";
    switch (errCode) {
        case 400:
            msg = "Nhập thiếu tham số";
            break;
        case 500:
            msg = "Không thể kết nối tới hệ thống SAP";
            break;
        case 419:
            msg = "Phiên đăng nhập đã hết hạn, đăng nhập lại";
            break;
    }

    return msg;
};

const getDataDHN = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_SEARCH);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode ?? "";
    const plantCode = req.body.plantCode ?? "";
    const date = req.body.date ?? "";
    const plantFlg = req.body.plantFlg ?? "";
    const lttFlg = req.body.lttFlg ?? "";
    const tonDauNgayFlg = req.body.tonDauNgayFlg ?? "";

    if (userInfo.success) {
        const data = await search({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            plantCode,
            date,
            plantFlg,
            lttFlg,
            tonDauNgayFlg,
        });
        res.json(data);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

const confirmDataDHN = async (req, res) => {
    const jwtDecoded = req.jwtDecoded;
    const apiSAP = API_MOBILE(jwtDecoded.server, FM_CONFIRM);
    const userInfo = await getUser(jwtDecoded);

    const companyCode = req.body.companyCode || "";
    const plantCode = req.body.plantCode || "";
    const date = req.body.date || "";
    const plantFlg = req.body.plantFlg || "";
    const lttFlg = req.body.lttFlg || "";
    const tonDauNgayFlg = req.body.tonDauNgayFlg || "";

    if (userInfo.success) {
        const resultConfirm = await confirm({
            username: userInfo.username,
            password: userInfo.password,
            apiSAP,
            companyCode,
            plantCode,
            date,
            plantFlg,
            lttFlg,
            tonDauNgayFlg,
        });

        res.json(resultConfirm);
    } else {
        res.json({
            success: false,
            msg: "Lỗi API",
        });
    }
};

// Trả file base64 SAP về cho client dưới dạng HTML để xem trực tiếp trong webview/browser
const sendExcelAsHtml = async (res, result) => {
    if (!result.success || !result.base64) {
        return res.json(result);
    }

    const buffer = Buffer.from(result.base64, "base64");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    const tableHtml = excelWorksheetToHtml(worksheet);
    const htmlString = `<html><head><meta charset="utf-8"><style>table{border-collapse:collapse}td,th{padding:4px;border:1px solid #ccc}</style></head><body>${tableHtml}</body></html>`;

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(htmlString);
};

const downloadFileDHN = async (req, res) => {
    const server = req.params.server || "";
    const apiSAP = API_MOBILE(server, FM_FILE);
    const auth = getUserAuthSAP(server);

    const date = req.body.date ?? "";

    const result = await getFileDHN({
        username: auth.username,
        password: auth.password,
        apiSAP,
        date,
    });

    await sendExcelAsHtml(res, result);
};

// ---- Cấp URL xem file DHN dạng PDF ----
// Trình duyệt mở link trực tiếp nên không gửi kèm Basic Auth được. getDhnViewUrl
// (POST, đi qua Basic Auth như mọi FUNC khác) trả về một URL công khai kèm
// server/date dạng query (KHÔNG trả thẳng file, không token). URL đó do
// controllers/LIMS/serveDhnFilePublic.js phục vụ (GET, không cần Basic Auth,
// không xác thực gì thêm).
const getDhnViewUrl = async (req, res) => {
    const server = req.params.server || "";
    const date = req.body.date ?? "";

    if (!date) {
        return res.status(400).json({ success: false, msg: "Thiếu tham số date" });
    }

    const url = `${PUBLIC_BASE_URL}/${server}/lims/plx/api/dhn-view?server=${encodeURIComponent(server)}&date=${encodeURIComponent(date)}`;

    res.json({ success: true, url });
};

module.exports = {
    getDataDHN,
    confirmDataDHN,
    downloadFileDHN,
    getDhnViewUrl,
}