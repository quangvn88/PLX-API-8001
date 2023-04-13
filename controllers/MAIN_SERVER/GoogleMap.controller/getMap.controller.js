const axios = require("axios");

module.exports.getMap = async ({ id, username, password, urlServer }) => {
  const ZFM = "/ZFM_GET_MAP";
  const url = urlServer + ZFM + "?id=" + id;

  const source = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
  })
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
      return { success: false, src: "", msg: "Lỗi API" };
    });
  return source;
};
