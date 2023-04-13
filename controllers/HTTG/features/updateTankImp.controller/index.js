const sql = require('mssql');

const { updateIntSap } = require('../requestSQL/updateTankImp')

module.exports.updateTankImp = async function (req, res) {
    const headerID = req.body.headerID || '';
    const detailID = req.body.detailID || '';
    const statusInt = req.body.statusInt || '';
    const desInt = req.body.desInt || '';
    const params = {
        headerID,
        detailID,
        statusInt,
        desInt
    }

    const configSQL = req.body.configSQL;

    let objConfigSQL_PLX;//parse to object
    let configSQL_PLX;//config SQL

    try {
        //Config SQL
        objConfigSQL_PLX = JSON.parse(configSQL);
        configSQL_PLX = getConfigSQL(objConfigSQL_PLX);
    } catch (error) {

    }

    if (typeof configSQL_PLX === 'undefined' || !configSQL_PLX) {
        res.status(500).json({ success: false, message: 'Get config SQL err' })
        return;
    }

    const paramsIsCorrect = validateParams(params)
    if (!paramsIsCorrect) {
        res.status(400).json({ success: false, message: 'Bad request' })
        return;
    }
    try {
        //Connect SQL server
        await sql.connect(configSQL_PLX);
        //Update Tank Imp
        await updateIntSap(sql, params);
        res.json({ success: true, message: 'ok' })
    } catch (err) {
        // ... error checks
        console.log(err)
        res.status(500).json({ success: false, message: 'SQL fail' })
    }

    sql.close();
}

const getConfigSQL = (configSAP) => {
    return {
        user: configSAP.USERNAME,
        password: configSAP.PASSWORD,
        server: configSAP.SERVER,
        database: configSAP.DBNAME,
        options: {
            encrypt: false,
            trustServerCertificate: true,
        }
    }
}

const validateParams = (params) => {
    //các giá trị phải là text
    for (const key in params) {
        const element = params[key];
        if (typeof element != "string") {
            // return false;
        } else {
            const stringUpper = element.toUpperCase();
            if (stringUpper.includes(` AND `) || stringUpper.includes("OR")) {
                return false;
            }
        }
    }

    return true;
}