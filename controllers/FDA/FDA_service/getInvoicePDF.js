const axios = require("axios");

const { API_FDA_GET_INVOICE } = require("../../../api/FDA_API");

const getInvoice = function (req, res) {
  const invid = req.query.invid || "";
  const server = req.body.server || "";
  const envir = req.body.envir || "";

  if (!invid || !server) {
    res.sendStatus(404);
    return;
  }

  const url = API_FDA_GET_INVOICE(server, envir);

  const headers = {
    api_key: "UExYLFBldHJvbGltZXgsREVNTywzMS8xMi8yMDIy",
    "Content-Type": "application/json",
  };

  const data = {
    invid,
  };

  axios({
    method: "post",
    url,
    headers: headers,
    data: data,
    responseType: "arraybuffer",
  })
    .then(function (response) {
      const resHeader = response.headers;
      res.set("Content-Type", resHeader["content-type"]);
      const data = response.data;
      res.end(data, "binary");
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
};

module.exports = { getInvoice };
