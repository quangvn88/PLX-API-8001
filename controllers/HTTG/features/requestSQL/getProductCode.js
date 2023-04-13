
module.exports.getProductCode = async function (sql, maBe) {
    const request = new sql.Request();
    const result = await request.query(`select * from tblTank where Name_nd = '${maBe}'`)
    const recordSQL = result.recordset[0];
    try {
        return recordSQL.Product_nd
    } catch (error) {
        // console.log('error' + error)
        return '';
    }
    // if (recordSQL.Product_nd)
    //     return recordSQL.Product_nd
    // const productCode = recordSQL.Product_nd || ''
    // return productCode;
}