const axios = require("axios");

module.exports.release = async ({
	username,
	password,
	serverUrl,
	vbelns,
	reason,
}) => {
	const ZFM = "/ZFM_LENHXUAT_RELEASE";
	const url = serverUrl + ZFM;

	const textVbelns = vbelns.join(" ");
	const resultRelease = await axios({
		method: "get",
		url,
		auth: {
			username: username,
			password: password,
		},
		data: {
			I_LIDO: reason,
			IT_VBELN: vbelns,
		},
	})
		.then((res) => {
			const data = res.data;
			const success = data.RETURN.TYPE === "S";
			const msg =
				data.RETURN.TYPE === "S"
					? `Phê duyệt thành công lệnh xuất: ${textVbelns}`
					: data.RETURN.MESSAGE;
			return {
				success: success,
				msg: msg,
			};
		})
		.catch((err) => {
			console.log("Release credit failed: " + err);
			return {
				success: false,
				msg: "Lỗi API",
			};
		});
	return resultRelease;
};
