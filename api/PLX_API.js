const { PLX_ORIGINAL_URL } = require("./index");

const BASE_URL_MAP = {
  dev: PLX_ORIGINAL_URL.DEV,
  qas: PLX_ORIGINAL_URL.QAS,
  prd: PLX_ORIGINAL_URL.PRD,
  prd_dia: PLX_ORIGINAL_URL.PRD,
};

const PLX_BASE_URL = (server = "dev") =>
  BASE_URL_MAP[server] || PLX_ORIGINAL_URL.DEV;

const SAP_URL = (server = "dev", fm) => {
	if (!fm) {
		throw new Error("FM name is required");
	}
	
	const path = `/sap/plx/${fm}`;
	const clientParam = server === "dev" ? "?sap-client=300" : "";
	return `${PLX_BASE_URL(server)}${path}${clientParam}`;
};

module.exports = {
  SAP_URL
};