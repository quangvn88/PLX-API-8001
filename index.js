const http = require("http");
const https = require("https");

const { initSocket } = require("./socket/chatHandler");
const { httpsOptions } = require("./utils/ssl");

const app = require("./app");

const PORT = process.env.PORT || 8001;
const PORT_HTTPS = process.env.PORT_HTTPS || 443;

// HTTP server
const server = http.createServer(app);
initSocket(server);
server.listen(PORT, () => console.log(`🚀 HTTP Server listening on port ${PORT}`));

// HTTPS server
// const httpsServer = https.createServer(httpsOptions, app);
// httpsServer.listen(PORT_HTTPS, () => console.log("🔐 HTTPS Server running on port 443"));
