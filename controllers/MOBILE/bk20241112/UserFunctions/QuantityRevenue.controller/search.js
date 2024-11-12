const axios = require("axios");
const moment = require("moment");

module.exports.search = async ({
  username,
  password,
  multiMatnr,
  multiBukrs,
  fromBukrs,
  toBukrs,
  fromDate,
  toDate,
  fromMatnr,
  toMatnr,
  serverUrl,
}) => {
  const ZFM = "/ZFM_SLDT_GET";
  const url = serverUrl + ZFM;

  const fDate = moment(
    moment("" + fromDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");
  const tDate = moment(
    moment("" + toDate.replace(/\./g, ""), "DDMMYYYY")
  ).format("YYYYMMDD");

  const report = await axios({
    method: "get",
    url,
    auth: {
      username: username,
      password: password,
    },
    data: {
      IT_BUKRS: multiBukrs,
      IT_MATNR: multiMatnr,
      I_BUKRS_F: fromBukrs,
      I_BUKRS_T: toBukrs,
      I_FKDAT_F: fDate,
      I_FKDAT_T: tDate,
      I_MATNR_F: fromMatnr,
      I_MATNR_T: toMatnr,
    },
  })
    .then((res) => {
      const data = res.data;
      if (data.RETURN.TYPE === "S") {
        const dataRaw = data.DATA.SLDT;
        const sum = data.DATA.SUM;
        if (dataRaw.length === 0) {
          return {
            success: false,
            msg: "Không tìm thấy kết quả phù hợp",
          };
        } else {
          const dataCleaned = dataRaw.map((item) => {
            return {
              vtweg: item.VTWEG,
              vtext: item.VTEXT,
              arrayMatnr: item.LISTMATHANG,
            };
          });
          return {
            success: true,
            data: {
              arrayVt: dataCleaned,
              sanluong_nd: sum.FKLMG_ND,
              sanluong_tx: sum.FKLMG_TX,
              doanhthu_nd: sum.NETWR_ND,
              doanhthu_tx: sum.NETWR_TX,
            },
          };
        }
      } else {
        return {
          success: false,
          msg: data.RETURN.MESSAGE,
        };
      }
      // handle data
      //   const dataCleaned = data.DATA.map((item) => {
      //     return {
      //       vtweg: item.VTWEG,
      //       vtext: item.VTEXT,
      //       arrayMatnr: item.LISTMATHANG,
      //     };
      //   });

      //   if (data.NOT_AUTH.length === 0) {
      //     if (data.DATA.length === 0) {
      //       return {
      //         success: false,
      //         msg: "Không tìm thấy kết quả phù hợp",
      //       };
      //     } else {
      //       return {
      //         success: true,
      //         data: {
      //           arrayVt: dataCleaned,
      //           sanluong_nd: data.ESUM_FKLMG_ND,
      //           sanluong_tx: data.ESUM_FKLMG_TX,
      //           doanhthu_nd: data.ESUM_NETWR_ND,
      //           doanhthu_tx: data.ESUM_NETWR_TX,
      //         },
      //         msg: "",
      //       };
      //     }
      //   } else {
      //     return {
      //       success: false,
      //       msg: "Tài khoản không có quyền với: " + data.NOT_AUTH.join(", "),
      //     };
      //   }
    })
    .catch((err) => {
      console.log("Failed get san luong doanh thu: " + err);
      return {
        success: false,
        msg: "Lỗi API",
      };
    });

  return report;
};
