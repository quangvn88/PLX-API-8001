const APILogModel = require("../../models/APILog.model");

const getAPILog = async function (req, res) {        
    const {        
        FUNC,
        FROM_DATE,
        TO_DATE,
        SEARCH_VALUE
    } = req.body.DATA;
    
    const query = {
        date: { $gte: FROM_DATE, $lte: TO_DATE },
        ...(FUNC && { "body.FUNC": FUNC }),
        ...(SEARCH_VALUE && { bodyAsString: { $regex: SEARCH_VALUE, $options: 'i' }})
    };

    const logs = await APILogModel.find(query)
                                  .sort({ date: -1 }) 
                                  .select("_id body.FUNC body.DATA.CATEGORY_TYPE statusCode date time ip");
     
    const result = logs.map(doc => ({
        _ID: doc._id,
        FUNC: doc.body?.FUNC || null,
        CATEGORY_TYPE: doc.body.DATA?.CATEGORY_TYPE || "",
        STATUSCODE: doc.statusCode,
        BODY: "",
        RESPONSE_BODY: "", 
        DATE: doc.date,
        TIME: doc.time,
        IP: doc.ip,
        CATEGORY: doc.category
    }));

    res.status(200).json(result);
}

module.exports = { getAPILog };