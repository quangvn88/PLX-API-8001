const axios = require("axios");
const moment = require("moment");
const qs = require("qs");

module.exports.search = async ({
	username,
	password,
	serverUrl,
	fromBukrs,
	toBukrs,
	fromDate,
	toDate,
	vbeln,
	kunnrs,
	// sKunnr,
	// mKunnr,
}) => {
	const ZFM = "/ZFM_LENHXUAT_GET";
	const url = serverUrl + ZFM;

	let dateF;
	let dateT;

	try {
		dateF = moment(moment("" + fromDate.replace(/\./g, ""), "DDMMYYYY")).format(
			"YYYYMMDD"
		);
	} catch (error) { }

	try {
		dateT = moment(moment("" + toDate.replace(/\./g, ""), "DDMMYYYY")).format(
			"YYYYMMDD"
		);
	} catch (error) { }

	const data = qs.stringify({
		I_BUKRS_F: fromBukrs,
		I_BUKRS_T: toBukrs,
		I_DODATE_F: dateF,
		I_DODATE_T: dateT,
		IT_KUNNR: kunnrs,
		I_VBELN: vbeln,
	});

	const result = await axios({
		method: "get",
		url,
		data: data,
		auth: {
			username: username,
			password: password,
		},
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			// Accept: "*/*",
		},
	})
		.then((res) => {
			const data = res.data;
			// Handle data
			let credits = data.DATA || []
			if (data.RETURN.TYPE == "S") {
				return {
					success: true,
					data:
						credits.map((e) => {
							return {
								...e,
								checked: false,
							};
						}),
					msg: data.RETURN.MESSAGE || "",
				};
			} else {
				const msgErr = data.RETURN.MESSAGE || "";
				return {
					success: false,
					msg: msgErr,
				};
			}
		})
		.catch((err) => {
			// const resError = new Error(err);
			const errCode = err.response.status ? err.response.status : 500;
			// console.log("Search credit failed: " + errCode);
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
