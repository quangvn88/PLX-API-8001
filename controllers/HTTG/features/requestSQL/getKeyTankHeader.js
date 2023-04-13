module.exports.getKeyTankHeader = async function (sql) {
    let keyTankHeader = {
        newKey: '',
        numberID: ''
    }
    const request = new sql.Request();
    request.input('p_Value', sql.NVarChar(500), 'sysadmin');

    const result = await request.execute('GetKeyztblTankHeader');
    const recordSQL = result.recordset[0];
    keyTankHeader.newKey = recordSQL.newKey ? recordSQL.newKey : '';//Nếu null, underfine -> gán bằng trắng
    keyTankHeader.numberID = recordSQL.NumberID ? recordSQL.NumberID : '';

    return keyTankHeader;
}