const AccountingPeriod = require("./AccountingPeriod.controller");
const CCodeConfigTransferCT = require("./CcodeConfigTransferCT.controller");
const Delivery = require("./Delivery.controller");
const NegativeInventory = require("./NegativeInventory.controller");
const PoBog = require("./PoBog.controller");
const PoCkg = require("./PoCkg.controller");
const PurchaseOrder = require("./PurchaseOrder.controller");
const QuantityRevenue = require("./QuantityRevenue.controller");
const EgasIntegrateTimeCf = require("./EgasIntegrateTimeCf.controller");
const UserSAP = require("./UserSAP.controller");
const WarehousePeriod = require("./WarehousePeriod.controller");

module.exports = {
    ...AccountingPeriod, // Kỳ kế toán
    ...CCodeConfigTransferCT, // Config Company Code DO chuyển thẳng 
    ...Delivery, // Lệnh xuất
    ...NegativeInventory, // Xuất âm tồn kho
    ...PoBog, // PO Bình ổn giá
    ...PoCkg, // PO Chu kỳ giá
    ...PurchaseOrder, // Đơn hàng
    ...QuantityRevenue, // Sản lượng doanh thu
    ...EgasIntegrateTimeCf, // Config Mở thời gian tích hợp SAP - Egas
    ...UserSAP, // User SAP
    ...WarehousePeriod, // Kỳ kho
}