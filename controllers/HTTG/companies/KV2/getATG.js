const sql = require('mssql');
// const { KV2_SQL_CONFIG } = require('./index')

// const moment = require('moment');

module.exports.KV2_getDataATG = async function ({ thoiDiem, maBe, tankId, tableATG, configSQL_ATG }) {
    //Select bảng lấy data ATG
    // const TankID = maBe;
    const date = thoiDiem.replace(/[\/]/g, "-");
    const dateSAP = date.substring(0, 10);

    const fields = `ABS(datediff(second,Datetime,'${date}')) as DIFF,`
        + `Datetime,`
        + `TankID,`
        + `ProdLevel,`
        + `ProdTemp`

    const condition = `(Datetime BETWEEN '${dateSAP} 00:00:00' AND '${date}' OR Datetime >= '${date}')`
        + ` AND TankID = '${tankId}' order by DIFF, Datetime DESC`

    // const condition = `Datetime >='${thoidiem}' AND TankID = '${tankId}'`
    // console.log(condition)
    // const ATG_SAMPLE_DATA = JSON.parse(`
    // {
    //     "thoidiem": "2022-11-11T16:59:30",
    //     "Ma_be": "00D1",
    //     "ChieuCaoBe": 812.0,
    //     "ChieuCaoNuoc": 0.0,
    //     "NhietDo": 26.6,
    //     "TrongBe": 4318212.0,
    //     "TOV": 410.838,
    //     "FlowRate": -4.471,
    //     "LevelRate": -0.01
    // }`)
    // thoidiem - Datetime
    // Ma_be - TankID
    // ChieuCaoNuoc- ProdLevel
    // NhietDo - ProdTemp
    let dataATG;
    try {
        //Connect SQL server
        await sql.connect(configSQL_ATG);
        // const queryGetTankID
        const query = `SELECT TOP 1 ${fields} from ${tableATG} where ${condition}`;
        console.log(query)
        const result = await sql.query(query);

        if (result.recordset.length == 0) {
            dataATG = {
                success: false,
                message: "No value found"
            }
        } else {
            const recordSQL = result.recordset[0];
            const thoidiem = recordSQL.Datetime.toISOString();
            dataATG = {
                success: true,
                Client: maBe.substring(0, 1),
                data: {
                    thoidiem: thoidiem,//Datetime
                    Ma_be: maBe,
                    ChieuCaoBe: recordSQL.ProdLevel,//ProdLevel
                    ChieuCaoNuoc: 0,
                    NhietDo: recordSQL.ProdTemp,//ProdTemp
                    TrongBe: 0,
                    TOV: 0,
                    FlowRate: 0,
                    LevelRate: 0,
                }
            }
        }
    } catch (err) {
        // ... error checks
        console.log(err);
        dataATG = {
            success: false,
            message: "get data ATG SQL fail"
        }
    }
    sql.close()
    return dataATG;
}