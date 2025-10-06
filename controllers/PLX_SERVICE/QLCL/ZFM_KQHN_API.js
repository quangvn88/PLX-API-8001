const axios = require("axios");
const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP')
const { API_PLX } = require("../../../api/PLX_API")

module.exports.ZFM_KQHN_API = async (req, res) => {
    const header = req.body.header || [];
    const detail = req.body.detail || [];
    const server = req.body.server || '';

    const AUTH = getUserAuthSAP(server);
    const url = `${API_PLX(server)}/ZFM_API_KQHN`;

    const resultRequest = await search({
        username: AUTH.username,
        password: AUTH.password,
        url: url,
        header: header,
        detail: detail
    });

    if (resultRequest.success) {
        res.status(200).json(resultRequest.data);
    } else {
        res.status(500).json(resultRequest.msg);
    }
};

const search = async ({
    username,
    password,
    url,
    header,
    detail
}) => {

    const data =
    {
        T_HEADER: header,
        T_DETAIL: detail,
    }

    const orders = await axios({
        method: "get",
        url: url,
        auth: {
            username: username,
            password: password,
        },
        data: data,
    })
        .then((res) => {
            const data = res.data;
            // handle data
            return {
                success: true,
                data: data
            };
        })
        .catch((err) => {
            return {
                success: false,
                msg: "Lỗi API",
            };
        });

    return orders;
};
