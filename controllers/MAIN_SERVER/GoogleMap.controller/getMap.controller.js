const axios = require("axios");
const { getUserAuthSAP } = require("../../../scripts/getUserAuthSAP");
const { SAP_URL } = require("../../../api/PLX_API");

module.exports.getMap = async ({ id, server, urlServer }) => {
  const url = SAP_URL(server, "ZFM_GET_MAP");
  const data = { ID: id };
  const auth = getUserAuthSAP(server);

  let config = {
    method: "get",
    url,
    auth,
    params: { ID: id },
  };

  console.log(config);

  console.log(url);
  const source = await axios(config)
    .then((res) => {
      const data = res.data;
      const IFRAME = data.IFRAME ? data.IFRAME : [];
      let src = "";
      for (x of IFRAME) {
        src += x.TDLINE;
      }
      return {
        success: src === "" ? false : true,
        src: src,
        msg: src === "" ? "Chưa bổ sung thông tin iframe địa chỉ" : "",
      };
    })
    .catch((err) => {
      console.error("Chi tiết lỗi API:", err.message); // In lỗi ra terminal để debug
      if (err.response) {
        console.error("Data từ Server:", err.response.data);
        console.error("Status từ Server:", err.response.status);
      }
      return { success: false, src: "", msg: "Lỗi API" };
    });
  return source;
};
