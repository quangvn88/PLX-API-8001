const axios = require("axios");

module.exports.release = async ({
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
	const ZFM = "/ZFM_DHN_CONFIRM";
	const url = serverUrl + ZFM;

	const data = qs.stringify({
		I_BUKRS: companyCode,
		I_WERKS: plantCode,
		I_BUDAT: date,
		I_LTT: lttFlg,
		I_L15: plantFlg,
		I_BEGIN: tonDauNgayFlg
	});

	const resultConfirm = await axios({
		method: "get",
		url,
		auth: {
			username: username,
			password: password,
		},
		data: data,
	})
		.then((res) => {
			const data = res.data;

			return {
				success: data.RETURN.TYPE === "S",
				msg: data.RETURN.MESSAGE || "",
			};
		})
		.catch((err) => {
			const errCode = err.response.status ? err.response.status : 500;
			return {
				success: false,
				msg: getMessageError(errCode),
			};
		});

	return resultConfirm;
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

