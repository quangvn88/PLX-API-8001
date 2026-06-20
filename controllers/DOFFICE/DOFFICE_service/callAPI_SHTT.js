const axios = require("axios");
const { DOFFICE_SHTT_URL } = require("../../../api/DOFFICE_API");
const { HMAC_SHA512 } = require("./HMAC_SHA512");
const FormData = require("form-data");

const callAPI_SHTT = function (req, res) {
  const server = req.params.server || "";
  const func = req.body.FUNC || "";
  const dataForm = req.body.DATA || "";

  let _data = new FormData();
  let strPost = JSON.stringify(dataForm);
  _data.append("data", strPost);

  const url = DOFFICE_SHTT_URL(server);

  const _params = {
    func,
  };

  const res_SHA512 = HMAC_SHA512(process.env.DOFFICE_SECRETKEY, strPost);

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      "X-Nonce": res_SHA512.nonce,
      "X-Signature": res_SHA512.signature,
      ..._data.getHeaders(),
    },
    params: _params,
    data: _data,
  };

  axios
    .request(config)
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

module.exports = { callAPI_SHTT };
