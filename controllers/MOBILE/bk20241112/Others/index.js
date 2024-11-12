const Parameters = require("./Parameters.controller");
const AuthorUserSap = require("./AuthorUserSap.controller");
const UserAuth = require("./UserAuth.controller");

module.exports = {
    ...Parameters,
    ...AuthorUserSap,
    ...UserAuth
}