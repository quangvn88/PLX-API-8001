module.exports.insertTankHeaderImp = async function (sql, dataInsertHeader) {
    const query = getQueryInsertTankHeaderImp(dataInsertHeader);
    const request = new sql.Request();
    await request.query(query);
    return true;
}

module.exports.insertTankLineImp = async function (sql, dataInsertDetail) {
    const query = getQueryInsertTankLineImp(dataInsertDetail);
    const request = new sql.Request();
    await request.query(query);
    return true;
}

const getQueryInsertTankHeaderImp = function (dataInsertHeader) {
    const dataATG = dataInsertHeader.dataATG;
    const keyTankHeader = dataInsertHeader.keyTankHeader;


    const fields = `TankHeaderCode,DocEntry,FromDate,crDate,TankList,sType,Client`;
    const values = `'${keyTankHeader.newKey}',`//TankHeaderCode
        + `'${keyTankHeader.numberID}',`//DocEntry
        + `'${dataInsertHeader.thoiDiem}',`//FromDate
        + `'${dataInsertHeader.thoiDiem}',`//crDate
        + `'${dataATG.Ma_be}',`//TankList
        + `'A',`//sType
        + `'${dataInsertHeader.Client}'`//Client
    return `SET IDENTITY_INSERT ztblTankHeaderImp ON`
        + ` INSERT INTO ztblTankHeaderImp(${fields}) VALUES(${values})`
        + ` SET IDENTITY_INSERT ztblTankHeaderImp OFF`
}

const getQueryInsertTankLineImp = function (dataInsertDetail) {
    const dataATG = dataInsertDetail.dataATG;
    const keyTankHeader = dataInsertDetail.keyTankHeader;

    const fields = `TankHeaderCode,crDate,TankCode,TankMap,TankHeight,WaterHeight,TankTemp,PurposeCode,ProductCode`
    const values = `'${keyTankHeader.newKey}',`//TankHeaderCode
        + `'${dataATG.thoidiem}',`//crDate
        + `'${dataATG.Ma_be}',`//TankCode
        + `'${dataATG.Ma_be}',`//TankMap
        + `'${dataATG.ChieuCaoBe}',`//TankHeight
        + `'${dataATG.ChieuCaoNuoc}',`//WaterHeight
        + `'${dataATG.NhietDo}',`//TankTemp
        + `'02',`//PurposeCode
        + `'${dataInsertDetail.matHang}'`//ProductCode

    return `INSERT INTO ztblTankLineImp(${fields}) VALUES(${values})`
}