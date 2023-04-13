const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { save } = require("./save");

module.exports.getTableUpdateFlg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  if (userInfo.success) {
    const resultSearch = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
    });

    res.json(resultSearch);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports.saveTableUpdateFlg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const arrTableUpdateFlg = req.body.arrTableUpdateFlg || "";
  if (!arrTableUpdateFlg) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultSearch = await save({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      arrTableUpdateFlg: arrTableUpdateFlg,
    });

    res.json(resultSearch);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};
