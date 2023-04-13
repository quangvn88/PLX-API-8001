const sql = require('mssql');
const { B12_getDataATG } = require('../../companies/B12/getATG');
const { KV2_getDataATG } = require('../../companies/KV2/getATG');

const { insertTankHeaderImp, insertTankLineImp } = require('../requestSQL/insertTankImp');
const { getProductCode } = require('../requestSQL/getProductCode');
const { getKeyTankHeader } = require('../requestSQL/getKeyTankHeader');
const { updateTankATG_QCI } = require('../requestSQL/updateTankImp');
const { getDataTankImp } = require('../requestSQL/getDataTankImp');
const moment = require('moment/moment');

module.exports.insertTankImp = async function (req, res) {
    const thoiDiem = req.body.thoiDiem || '';
    const maKho = req.body.maKho || '';
    const maBe = req.body.maBe || '';
    const bukrs = req.body.bukrs || '';
    const tankId = req.body.tankId || '';
    const matHang = req.body.matHang || '';

    const configSQL = req.body.configSQL;
    const configATG = req.body.configATG;

    let objConfigSQL_PLX;//parse to object
    let objConfigSQL_ATG;//parse to object

    let configSQL_PLX;//config SQL
    let configSQL_ATG;//config SQL

    let tableATG = '';

    try {
        //Config SQL
        objConfigSQL_PLX = JSON.parse(configSQL);
        configSQL_PLX = getConfigSQL(objConfigSQL_PLX);
        //Config ATG
        objConfigSQL_ATG = JSON.parse(configATG);
        configSQL_ATG = getConfigSQL(objConfigSQL_ATG);

        if (objConfigSQL_ATG) {
            tableATG = objConfigSQL_ATG.TBNAME || '';
        }

    } catch (error) {

    }

    if (typeof configSQL_PLX === 'undefined' || !configSQL_PLX) {
        res.status(500).json({ success: false, message: 'Get config SQL err' })
        return;
    }

    //validate param
    const params = {
        bukrs,
        thoiDiem,
        maKho,
        maBe,
        tankId,
        bukrs,
        tableATG: tableATG,
        configSQL_ATG
    }
    const paramsIsCorrect = validateParams(params)
    if (!paramsIsCorrect) {
        res.status(400).json({ success: false, message: 'Bad request' })
        return;
    }
    //get data ATG 
    const resATG = await getDataATG(params);
    if (typeof resATG === 'undefined' || !resATG.success) {
        res.status(404).json({ success: false, message: resATG.message || 'Get data ATG err' })
        return;
    }

    const dataATG = resATG.data;
    const thoiDiemIsCorrect = checkThoiDiem(dataATG.thoidiem, thoiDiem)
    if (!thoiDiemIsCorrect) {
        res.status(404).json({ success: false, message: 'No data' })
        return;
    }

    try {
        //Connect SQL server
        // console.log(configSQL_PLX)
        await sql.connect(configSQL_PLX);
        //Get Mặt hàng trong bể
        // const matHang = await getProductCode(sql, configSQL_PLX.database, maBe);
        //Get key auto gen Header
        const keyTankHeader = await getKeyTankHeader(sql);
        //Insert header
        const dataInsertHeader = {
            keyTankHeader: keyTankHeader,
            thoiDiem: thoiDiem,
            dataATG: dataATG,
            Client: resATG.Client || 'ALL'//Field Client Bảng Header
        }
        // console.log(dataInsertHeader)
        await insertTankHeaderImp(sql, dataInsertHeader);
        // //Insert detail
        const dataInsertDetail = {
            keyTankHeader: keyTankHeader,
            matHang: matHang,
            dataATG: dataATG,
        }
        await insertTankLineImp(sql, dataInsertDetail);
        // //Call procerduce
        await updateTankATG_QCI(sql, keyTankHeader)
        // //send data TankImp
        const dataTankImp = await getDataTankImp(sql, keyTankHeader)
        res.json({ success: true, I_MAKHO: maKho, data: dataTankImp })
    } catch (err) {
        // ... error checks
        console.log(err)
        res.status(500).json({ success: false, message: 'SQL fail' })
    }

    sql.close();
}

const getDataATG = async (params) => {
    const { bukrs, thoiDiem, maKho, maBe, configSQL_ATG } = params;
    switch (bukrs) {
        case '2610':
            return await B12_getDataATG(thoiDiem, maKho, maBe);
        case '6610':
            // console.log('configATG' + configSQL_ATG);
            if (typeof configSQL_ATG === 'undefined' || !configSQL_ATG) {

                // res.status(500).json({ success: false, message: 'Get config SQL err' })
                return { success: false, message: 'Get config SQL ATG err' };
            } else {
                return await KV2_getDataATG(params);
            }
        default:
            return { success: false, message: `company ${bukrs} have not method getATG` };

    }
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

// const moment = require('moment')
const checkThoiDiem = (thoiDiemATG, thoiDiem) => {
    //Lấy 10 ký tự đầu
    const dateATG = thoiDiemATG.substr(0, 10);//yyyy-mm-dd
    // console.log(thoiDiem)
    const thoidiem = thoiDiem.substr(0, 10);
    const dateSAP = moment(thoidiem, 'MM/DD/YYYY').format('YYYY-MM-DD');;//mm-dd-yyyy
    // console.log(dateATG, dateSAP)
    return dateATG == dateSAP;
}