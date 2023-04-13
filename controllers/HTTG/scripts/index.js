module.exports.getConfigSQL = function (configSAP) {
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

module.exports.validateParams = function (params) {
    //các giá trị phải là text
    for (const key in params) {
        const element = params[key];
        if (typeof element != "string") {
            // return false;
        } else {
            const stringUpper = element.toUpperCase();
            if (stringUpper.includes(` AND `) || stringUpper.includes(` OR `)) {
                return false;
            }
        }
    }

    return true;
}