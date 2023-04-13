
module.exports.updateTankATG_QCI = async function (sql, keyTankHeader) {
    const request = new sql.Request();
    request.input('p_TankHeadercode', sql.NVarChar(100), keyTankHeader.newKey)
    await request.execute('FPT_UpdateTankATG_QCI');
    return true;
}

// const moment = require('moment')

module.exports.updateIntSap = async function (sql, data) {
    const request = new sql.Request();
    const { headerID, detailID } = data;
    const { statusInt, desInt } = data;

    // console.log(statusInt,desInt)
    //Update Header
    // const date = new Date().toLocaleString();
    // const currentDate = moment(date).format('YYYY-MM-DD HH:mm:ss')

    const fieldsHeader = `Status = '${statusInt}',`
        + `SyncUser = 'sysadmin',`
        + `SyncDate = SYSDATETIME( )`
    const conditionHeader = `TankHeaderCode = '${headerID}'`

    const queryHeader = `UPDATE ztblTankHeaderImp SET ${fieldsHeader} where ${conditionHeader}`;
    await request.query(queryHeader);

    //Update detail
    const fieldsDetail = `Description = N'${desInt}',`
        + `Status = '${statusInt}',`
        + `SynUser = 'sysadmin',`
        + `SynDate = SYSDATETIME ( ),`
        + `X = 'Y'`
    const conditionDetail = `ID = '${detailID}'`
    const queryDetail = `UPDATE ztblTankLineImp SET ${fieldsDetail} where ${conditionDetail}`;
    await request.query(queryDetail);

    return true;
}