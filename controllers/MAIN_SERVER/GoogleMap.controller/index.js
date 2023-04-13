const { getMap } = require("./getMap.controller");
const { API_PLX } = require("../../../api/PLX_API");
const { getUserAuthSAP } = require("../../../scripts/getUserAuthSAP");

module.exports.showMap = async (req, res) => {
  const server = req.params.server;
  const id = req.query.id;

  const SAP_AUTH = getUserAuthSAP(server);

  const urlServer = API_PLX(server);

  const map = await getMap({
    id: id,
    username: SAP_AUTH.username,
    password: SAP_AUTH.password,
    urlServer: urlServer,
  });

  // console.log(map)
  if (map.success) {
    res.render("home/map", {
      src: map.src,
    });
  } else {
    res.send(`${map.msg}`);
  }
};
