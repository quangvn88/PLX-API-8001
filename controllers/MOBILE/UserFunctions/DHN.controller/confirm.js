const axios = require("axios");
const moment = require("moment");

module.exports.confirm = async ({
	username,
	password,
	apiSAP,
	companyCode,
	plantCode,
	date,
	plantFlg,
	lttFlg,
	tonDauNgayFlg,
}) => {

	let budat = '00000000';

	try {
		budat = moment(moment("" + date.replace(/\./g, ""), "DDMMYYYY")).format(
			"YYYYMMDD"
		);
	} catch (error) { 
	}

	const data = {
		I_BUKRS: companyCode,
		I_WERKS: plantCode,
		I_BUDAT: budat,
		I_LTT: lttFlg,
		I_PLANT: plantFlg,
		I_BEGIN: tonDauNgayFlg
	};

	const resultConfirm = await axios({
		method: "get",
		url: apiSAP,
		auth: {
			username: username,
			password: password,
		},
		data: data,
	})
		.then((res) => {
			const data = res.data;

			return {
				success: data.E_RETURN.TYPE === "S",
				msg: data.E_RETURN.MESSAGE || "",
			};
		})
		.catch((err) => {
			console.log(err)
			const errCode = err.response?.status ? err.response.status : 500;
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

