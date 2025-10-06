const axios = require('axios');
const { SAP_URL } = require('../../../api/DOFFICE_API');
const { getUserAuthSAP } = require('../../../scripts/getUserAuthSAP');

const callZFM_EGAS_ITOB = (req, res) => {
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   
    const FROM_DATE = req.body.FROM_DATE || '';
    const TO_DATE = req.body.TO_DATE || ''; 
    const PLANT_F = req.body.PLANT_F || '';
    const PLANT_T = req.body.PLANT_T || '';
    const BUKRS_F = req.body.BUKRS_F || '';
    const BUKRS_T = req.body.BUKRS_T || '';    
    const DOC_NUMBER_F = req.body.DOC_NUMBER_F || '';
    const DOC_NUMBER_T = req.body.DOC_NUMBER_T || '';
    const MATNR_F = req.body.MATNR_F || '';
    const MATNR_T = req.body.MATNR_T || '';

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);    
    const AUTH = getUserAuthSAP(server);
    const data = {
        FROM_DATE,
        TO_DATE,
        PLANT_F,
        PLANT_T,
        BUKRS_F,
        BUKRS_T,        
        DOC_NUMBER_F,
        DOC_NUMBER_T,
        MATNR_F,
        MATNR_T
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,        
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            const responData = response.data;
            const e_data = { HEADER: responData.T_DATA_HDR, DETAIL: responData.T_DATA_DTL };      
            res.status(200).json({ DATA: e_data })                        
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

const callZAPI_EGAS_GET_DO = (req, res) => {    
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   

    const I_BURKS = req.body.BURKS || '';
    const I_SALE_OFFICE = req.body.SALE_OFFICE || ''; 
    const I_PLANT = req.body.PLANT || '';
    const I_INV_DATE = req.body.INV_DATE || '';
    const I_INV_NUMBER = req.body.INV_NUMBER || '';
    const I_MATNR = req.body.MATNR || '';    
    const I_REQUESTID = req.body.REQUESTID || '';    
    const I_REQUESTDATE = req.body.REQUESTDATE || '';    

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);
    const AUTH = getUserAuthSAP(server);
    const data = {
        I_BURKS,
        I_SALE_OFFICE,
        I_PLANT,
        I_INV_DATE,
        I_INV_NUMBER,
        I_MATNR,
        I_REQUESTID,
        I_REQUESTDATE
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,        
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            const responData = response.data;
            res.status(200).json({ 
                ET_DATA_L1: responData.ET_DATA_L1, 
                ET_DATA_L2: responData.ET_DATA_L2, 
                T_RETURN: responData.T_RETURN });                   
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

const callZAPI_EGAS_GET_LIST_DO = (req, res) => {    
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   

    const I_BURKS = req.body.BURKS || '';
    const I_SALE_OFFICE = req.body.SALE_OFFICE || ''; 
    const I_DATE_IM_F = req.body.DATE_F || '';
    const I_DATE_IM_T = req.body.DATE_T || '';
    const I_MATNR = req.body.MATNR || '';   
    const I_REQUESTID = req.body.REQUESTID || '';    
    const I_REQUESTDATE = req.body.REQUESTDATE || '';     

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);
    const AUTH = getUserAuthSAP(server);
    const data = {
        I_BURKS,
        I_SALE_OFFICE,
        I_DATE_IM_F,
        I_DATE_IM_T,
        I_MATNR,
        I_REQUESTID,
        I_REQUESTDATE
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,        
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            const responData = response.data;
            res.status(200).json({ 
                ET_DATA_L1: responData.ET_DATA_L1, 
                ET_DATA_L2: responData.ET_DATA_L2, 
                T_RETURN: responData.T_RETURN 
            });                   
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

const callZAPI_UPDATE_DO_FROM_EGAS = (req, res) => {    
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   

    const I_REQUESTID = req.body.REQUESTID || '';    
    const I_REQUESTDATE = req.body.REQUESTDATE || '';    
    const IT_DATA = req.body.IT_DATA || '';     

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);
    const AUTH = getUserAuthSAP(server);
    const data = {
        I_REQUESTID,
        I_REQUESTDATE,
        IT_DATA
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,        
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            const responData = response.data;
            res.status(200).json({ T_RETURN: responData.T_RETURN });                   
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

const callZAPI_EGAS_VEHICLE = (req, res) => {    
    const server = req.params.server || '';
    const func = req.body.FUNC || '';   

    const I_REQUESTID = req.body.REQUESTID || '';    
    const I_REQUESTDATE = req.body.REQUESTDATE || '';    
    const I_VEHICLE = req.body.VEHICLE || '';     
    const I_DATE = req.body.LASTDATE || '';     

    if (!server) {
        res.sendStatus(404);
        return;
    }    
    
    const url = SAP_URL(server, func);    
    const AUTH = getUserAuthSAP(server);
    const data = {
        I_REQUESTID,
        I_REQUESTDATE,
        I_VEHICLE,
        I_DATE
    };    

    let config = {
        method: 'get',
        url: url,
        auth: AUTH,        
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(response.data);
            const responData = response.data;
            res.status(200).json({ 
                HEADER: responData.ET_HEADER,
                DETAIL: responData.ET_DETAIL,
                T_RETURN: responData.T_RETURN
            });                   
            })
        .catch((error) => {
            console.log(error);
            res.status(500).json(error);
        });
}

module.exports = { 
    callZFM_EGAS_ITOB, 
    callZAPI_EGAS_GET_DO,
    callZAPI_EGAS_GET_LIST_DO, 
    callZAPI_UPDATE_DO_FROM_EGAS,
    callZAPI_EGAS_VEHICLE
};