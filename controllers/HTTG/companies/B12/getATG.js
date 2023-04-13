const { B12_BASE_URL } = require('./index')

const axios = require('axios');

module.exports.B12_getDataATG = async function (thoiDiem, maKho, maBe) {
    if (thoiDiem == '' || maKho == '' || maBe == '') {
        return { success: false }
    }
    // Example:'http://www.b12petroleum.com.vn/DoMucWebAPI/api/DoMucKhoBe?ThoiDiem=11/10/2022 00:00:01&MaKho=2621&MaBe=00D1'
    const url = B12_BASE_URL + `/DoMucKhoBe?ThoiDiem=${thoiDiem}&MaKho=${maKho}&MaBe=${maBe}`

    const data = await axios.get(url, {
        proxy: {
            host: 'proxy.petrolimex.com.vn',
            port: 8080
        }
    }).then(function (response) {
        //API tra về mảng
        const data = response.data[0];
        // console.log(url,response.data)
        if (data) {
            return { success: true, data: data, Client: 'ALL' };
        } else {
            return { success: false, message: "No value found" };
        }
    })
        .catch(function (error) {
            // console.log(error)
            return { success: false, message: "request ATG fail" };
        });
    return data;
}

const ATG_SAMPLE_DATA = JSON.parse(`
{
    "ChieuCaoBe": 792,
    "ChieuCaoNuoc": 0,
    "FlowRate": 2.396,
    "LevelRate": 0.02,
    "Ma_be": "00D3",
    "NhietDo": 26.8,
    "TOV": 103.697,
    "TrongBe": 882249,
    "thoidiem": "2022-11-15T00:00:01"
  }`)