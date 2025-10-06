const API_URLS = {
    ZFM_LIMS_GET_TOKEN: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/authorization/1.0.0/wso2/getToken-wso2', method: 'get'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/authorization/1.0.0/wso2/getToken-wso2', method: 'get'}
    },
    ZFM_LIMS_SHARED_MASTER_DATA: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/shared-master-data/original', method: 'put'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/shared-master-data/original', method: 'put'}
    },
    ZFM_LIMS_SEND_SAMPLE: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-sample-assignment-process', method: 'put'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-sample-assignment-process', method: 'put'}
    },
    ZFM_LIMS_SEND_ORDER_TLY: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-equipment-liquidation-order-creation-process', method: 'post'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-equipment-liquidation-order-creation-process', method: 'post'}
    },
    ZFM_LIMS_SEND_STAT_MO: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/respond-maintenance-result', method: 'post'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/respond-maintenance-result', method: 'post'}
    },
    ZFM_LIMS_TLDC_VTHCCC: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-transfer-order-creation-process', method: 'post'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-transfer-order-creation-process', method: 'post'},
    },
    ZFM_LIMS_TN_VTHCCC: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-receipt-process', method: 'post'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-receipt-process', method: 'post'}
    },
    ZFM_LIMS_TL_VTHCCC: {
        dev: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-liquidation-request-creation-process', method: 'post'},
        prd: {url: 'https://wso2gw-dev.petrolimex.com.vn/sapapi/1.0.0/opc/data-source/managing-liquidation-request-creation-process', method: 'post'}
    }
};

// Hàm helper lấy URL theo server
function getApiUrl(apiName, server = 'dev') {
    return API_URLS[apiName]?.[server] || null;
}

module.exports = { getApiUrl };
