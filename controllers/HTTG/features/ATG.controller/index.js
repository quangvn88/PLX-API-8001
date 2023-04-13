const { getDataATG, getTokenATG } = require('../../companies/8810');

module.exports.getData = async (req, res) => {
    const data = await getDataATG(req);
    res.json(data)
}

module.exports.getToken = async (req, res) => {
    const data = await getTokenATG(req);
    res.json(data)
}