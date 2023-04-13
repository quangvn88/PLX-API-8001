module.exports.getUserAuthSAP = (server) => {
    const USER_PRD = {
        username: process.env.SAP_PRD_USER,
        password: process.env.SAP_PRD_PASS
    }

    const USER_QAS = {
        username: process.env.SAP_QAS_USER,
        password: process.env.SAP_QAS_PASS
    }

    const USER_DEV = {
        username: process.env.SAP_DEV_USER,
        password: process.env.SAP_DEV_PASS
    }

    return {
        username: server === 'qas' ? USER_QAS.username
            : server === 'prd' ? USER_PRD.username
                : USER_DEV.username,
        password: server === 'qas' ? USER_QAS.password
            : server === 'prd' ? USER_PRD.password
                : USER_DEV.password,
    }
}
