const { callAPI } = require("./callAPI");
const { callAPI_SHTT } = require("./callAPI_SHTT");

const controllerDOFFICE = function (req, res) {
  const func = req.body.FUNC || "";

  switch (func) {
    case "AddOrUpdateCompany":
    case "UpdatePaymentDocNumber":
      return callAPI(req, res);

    case "GetItem":
    case "UpdateItemFromSAP":
      return callAPI_SHTT(req, res);

    default:
      return res.status(500).json("Error");
  }
};

module.exports = { controllerDOFFICE };
