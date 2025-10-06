const { API_MOBILE } = require("../../../../api/MOBILE_API");
const { getUser } = require("../../../../scripts/getUser");

const { search } = require("./search");
const { create } = require("./create");
const { remove } = require("./remove");

const getPoCkg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const gjahr = req.body.gjahr || "";
  const month = req.body.month || "";

  if (!gjahr || !month) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultSearch = await search({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      gjahr: gjahr,
      month: month,
    });

    res.json(resultSearch);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const createPoCkg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bedat = req.body.bedat || "";
  const timef = req.body.timef || "";
  const period = req.body.period || "";

  if (!bedat || !timef || !period) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultCreate = await create({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bedat: bedat,
      timef: timef,
      period: period,
    });
    res.json(resultCreate);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

const deletePoCkg = async (req, res) => {
  const jwtDecoded = req.jwtDecoded;
  const serverUrl = API_MOBILE(jwtDecoded.server);
  const userInfo = await getUser(jwtDecoded);

  const bedat = req.body.bedat || "";
  const timef = req.body.timef || "";

  if (!bedat || !timef) {
    res.sendStatus(400);
    return;
  }

  if (userInfo.success) {
    const resultDelete = await remove({
      username: userInfo.username,
      password: userInfo.password,
      serverUrl: serverUrl,
      bedat: bedat,
      timef: timef,
    });
    res.json(resultDelete);
  } else {
    res.json({
      success: false,
      msg: "Lỗi API",
    });
  }
};

module.exports = {
  getPoCkg,
  createPoCkg,
  deletePoCkg
}
