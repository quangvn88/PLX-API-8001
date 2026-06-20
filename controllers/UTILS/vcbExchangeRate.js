const axios = require("axios");
const { VCB_API_EXCHANGE_RATE } = require("../../api/VCB_API");

const vcbExchangerRate = function (req, res) {
  const { date } = req.query;

  let config = {
    method: "get",
    url: VCB_API_EXCHANGE_RATE,
    params: {
      date: date,
    },
    headers: {
      "Content-Type": "application/json",
    },
  };

  axios(config)
    .then((response) => {
      res.status(200).json({ DATA: response?.data?.Data });
    })
    .catch((error) => {
      res.status(500).json(error);
    });
};

module.exports = { vcbExchangerRate };
