const axios = require("axios");
const moment = require("moment");
const qs = require("qs");

module.exports.search = async ({
	username,
	password,
	serverUrl,
	companyCode,
	plantCode,
	date,
	plantFlg,
	lttFlg,
	tonDauNgayFlg,
}) => {
	const ZFM = "/ZFM_DHN_GET";
	const url = serverUrl + ZFM;

	let date = '00000000';
	try {
		date = moment(moment("" + date.replace(/\./g, ""), "DDMMYYYY")).format(
			"YYYYMMDD"
		);
	} catch (error) { }

	const data = qs.stringify({
		I_BUKRS: companyCode,
		I_WERKS: plantCode,
		I_BUDAT: date,
		I_LTT: lttFlg,
		I_L15: plantFlg,
		I_BEGIN: tonDauNgayFlg
	});

	const result = await axios({
		method: "get",
		url,
		data: data,
		auth: {
			username: username,
			password: password,
		}
	})
		.then((res) => {
			const data = res.data;
			// Handle data
			let dhnInfo = data.E_DATA || []
			if (data.E_RETURN.TYPE == "S") {
				return {
					success: true,
					data: dhnInfo,
					msg: data.E_RETURN.MESSAGE || "",
				};
			} else {
				const msgErr = data.E_RETURN.MESSAGE || "";
				return {
					success: false,
					msg: msgErr,
				};
			}
		})
		.catch((err) => {
			const errCode = err.response.status ? err.response.status : 500;
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
