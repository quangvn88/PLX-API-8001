const APILogModel = require("../../models/APILog.model");

const getAPILogField = async function (req, res) {        
    const _id = req.body.DATA.ID;
    const field = req.body.DATA.FIELD;
    
    try {
        const log = await APILogModel.findById(_id).select(field);      

        if (!log || log[field] === undefined) {
            return res.status(404).json({ error: `Field '${field}' not found` });
        }   

        res.status(200).send(log[field]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { getAPILogField };