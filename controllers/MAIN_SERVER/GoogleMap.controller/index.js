const { getMap } = require("./getMap.controller");
const { SAP_URL } = require("../../../api/PLX_API");

module.exports.showMap = async (req, res) => {
  const server = req.params.server;
  const id = req.query.id;
  const urlServer = SAP_URL("prd", "ZFM_GET_MAP");

  const map = await getMap({
    id,
    server,
    urlServer,
  });

  console.log("MAP");

  if (map.success) {
    console.log("map");
    res.render("home/map", {
      src: map.src,
    });
  } else {
    res.send(`${map.msg}`);
  }
};
