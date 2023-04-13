const { API_ATG_GET_DATA } = require('../../../../api/ATG_API')

const axios = require('axios');

module.exports.getDataATG = async function (req) {
    const tankTime = req.body.tankTime || '';
    const companyId = req.body.companyId || '';
    const warehouseId = req.body.warehouseId || '';
    const listTankId = req.body.listTankId || [];

    const token = req.body.token || '';
    const server = req.body.server;

    let tanks = [];
    let arrayTanks = [];

    try {
        arrayTanks = JSON.parse(listTankId);
    } catch (error) {
        arrayTanks = listTankId;
    }
    if (Array.isArray(arrayTanks)) {
        tanks = [...arrayTanks];
    } else {
        tanks.push(arrayTanks)
    }

    const DATA = {
        requestDate: "string",
        tankTime: tankTime,
        companyId: companyId,
        warehouseId: warehouseId,
        listTankId: tanks
    };
    // console.log(DATA)

    const url = API_ATG_GET_DATA(server)

    const data = await axios.post(url, DATA,
        {
            // proxy: {
            //     host: 'proxy.petrolimex.com.vn',
            //     port: 8080
            // },
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(function (response) {
            const data = response.data;
            return { success: true, data: data }
        })
        .catch(function (error) {
            const resError = error.response;
            // console.log(resError);
            return {
                success: false, message: "request ATG fail", error: { status: resError.status, statusText: resError.statusText, data: resError.data || {} }
            };
        });
    return data;
}

const ATG_SAMPLE_DATA = JSON.parse(`
{
    "code": "02-007-00",
    "message": "Thành công",
    "data": [
        {
            "companyId": 554373,
            "warehouseId": 0,
            "productId": 564454,
            "transId": 494410,
            "tankId": 565610,
            "tdhId": 115,
            "waterLevel": 0.026,
            "productLevel": 5.435,
            "totalLevel": 5.461,
            "waterVolume": 104.431,
            "productVolume": 3848.72,
            "totalVolume": 3952.458,
            "tankEmpty": 6848.133,
            "avgTemperature": 30.2,
            "productVolume15": 3809.232,
            "vcf": 0.98974,
            "wcf": 0.54324,
            "density": 1,
            "hMax": 15.727,
            "high": 13.616,
            "highHigh": 13.916,
            "low": 1.2,
            "lowLow": 1,
            "logTime": "11/07/2022 14:48:35",
            "ayDate": 1673707715
        }
    ]
}`)