const axios = require("axios");

module.exports.save = async ({
	username,
	password,
	arrCcodeConfig,
	serverUrl,
}) => {
	const ZFM = "/ZFM_NO_TRANSFER_CT_SAVE";
	const url = serverUrl + ZFM;

	const data = {
		IT_DATA: arrCcodeConfig,
	};
	const result = await axios({
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
			// handle data
			return {
				success: data.ES_RETURN.TYPE === "S",
				msg: data.ES_RETURN.MESSAGE,
			};
		})
		.catch((err) => {
			// console.log(err)
			return {
				success: false,
				msg: "Lỗi API",
			};
		});

	return result;
};
