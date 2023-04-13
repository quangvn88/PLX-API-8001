const { getOracleData } = require("../getOracleData");
const { QUERY_PLXID_CUSTOMER, QUERY_PLXID_CUSTOMER_DELETED } = require("./query");
const js2xmlparser = require("js2xmlparser");

module.exports.get_customer = async (req, res) => {
    const fromDate = req.body?.fromDate;
    const toDate = req.body?.toDate;

    const oracleConfig = req.body?.oracleConfig;
    let config;

    try {
        config = JSON.parse(oracleConfig)
    } catch (error) {
        res.status(500).json({ success: false, message: "missing config or config not valid" })
        return
    }
    // console.log(config);
    const props = {
        oracleConfig: config,
        query: QUERY_PLXID_CUSTOMER,
        binds: fromDate && toDate ? [fromDate, toDate] : []
    }

    const data = await getOracleData(props);
    if (data.success) {
        // res.status(200).json(data);
        res.status(200).send(js2xmlparser.parse("row", data));
    } else {
        res.status(500).json(data)
    }
}


module.exports.get_customer_deleted = async (req, res) => {
    const fromDate = req.body?.fromDate;
    const toDate = req.body?.toDate;

    const oracleConfig = req.body?.oracleConfig;
    let config;

    try {
        config = JSON.parse(oracleConfig)
    } catch (error) {
        res.status(500).json({ success: false, message: "missing config or config not valid" })
        return
    }
    // console.log(config);
    const props = {
        oracleConfig: config,
        query: QUERY_PLXID_CUSTOMER_DELETED,
        binds: fromDate && toDate ? [fromDate, toDate] : []
    }

    const data = await getOracleData(props);
    if (data.success) {
        // res.status(200).json(data);
        res.status(200).send(js2xmlparser.parse("row", data));
    } else {
        res.status(500).json(data)
    }
}