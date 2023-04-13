module.exports.getDataTankImp = async function (sql, keyTankHeader) {
    const request = new sql.Request();
    //get Header
    const dataHeader = await request.query(`select * from ztblTankHeaderImp where TankHeaderCode = '${keyTankHeader.newKey}'`);
    const recordHeader = dataHeader.recordset[0];
    
    //get Detail
    const dataDetail = await request.query(`select * from ztblTankLineImp where TankHeaderCode = '${keyTankHeader.newKey}'`);
    const recordDetail = dataDetail.recordset[0];
    return {
        header: recordHeader,
        detail: recordDetail,
    }
}