const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { processImportRequest } = require("./import");

module.exports.getRequests = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const fromDate = req.body.fromDate || "";
  const toDate = req.body.toDate || "";
  const userRequest = req.body.userRequest || "";
  const requests = req.body.requests || "";

  if (!fromDate && !toDate) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultRequest = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl || "",
      fromDate: fromDate || "",
      toDate: toDate || "",
      requests: requests || [],//array
      userRequest: userRequest || ""
    });

    res.json(resultRequest);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports.importRequest = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const request = req.body.request || "";

  if (!request) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultImport = await processImportRequest({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      request: request || "",
    });

    res.json(resultImport);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};
