const oracledb = require('oracledb');

module.exports.getOracleData = async function ({ oracleConfig, query, binds }) {
    let connection;
    try {
        connection = await oracledb.getConnection({
            user: oracleConfig.user,
            password: oracleConfig.password,
            connectionString: oracleConfig.connectionString
        });

        console.log("Successfully connected to Oracle Database");

        const data = await connection.execute(query, [...binds], {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });
        // console.log(data)
        return { success: true, data: data.rows }
    } catch (err) {
        console.error(err)
        return { success: false, error: err, message: 'query error' }
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err)

                return { success: false, error: error, message: 'close connection error' }
            }
        }
    }
}