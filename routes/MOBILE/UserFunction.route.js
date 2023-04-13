const express = require("express");
const router = express.Router({ mergeParams: true });

/* ---------- Others ---------- */
const OthersFunction = require("../../controllers/MOBILE/Others")
router.get("/getParams/:code", OthersFunction.getParameter);
router.get("/getUserInfo", OthersFunction.getAuthorUserSAP);
// new
router.get("/params/:code", OthersFunction.getParameter);
router.get("/user-info", OthersFunction.getAuthorUserSAP);
router.get("/user-auth", OthersFunction.getUserAuth);


/* ---------- Functions ---------- */
const UserFunction = require("../../controllers/MOBILE/UserFunctions")

// Lệnh xuất
router.post("/vbelns", UserFunction.getDeliveries);
router.post("/releaseVbelns", UserFunction.releaseDeliveries);
// new
router.post("/deliveries", UserFunction.getDeliveries);
router.post("/deliveries-release", UserFunction.releaseDeliveries);

// Đơn hàng
router.post("/ebelns", UserFunction.getPurchaseOrders);
router.post("/releaseEbeln", UserFunction.releasePurchaseOrders);
// new
router.post("/purchase-orders", UserFunction.getPurchaseOrders);
router.post("/purchase-order-release", UserFunction.releasePurchaseOrders);

// Po Chu kỳ giá
router.post("/getPo", UserFunction.getPoCkg);
router.post("/createPo", UserFunction.createPoCkg);
router.post("/deletePo", UserFunction.deletePoCkg);
// new
router.post("/po-ckg", UserFunction.getPoCkg);
router.post("/po-ckg-save", UserFunction.createPoCkg);
router.delete("/po-ckg", UserFunction.deletePoCkg);

// Po Bình ổn giá
router.post("/getPoBOG", UserFunction.getPoBog);
router.post("/createPoBOG", UserFunction.createPoBog);
router.post("/deletePoBOG", UserFunction.deletePoBog);
// new
router.post("/po-bog", UserFunction.getPoBog);
router.post("/po-bog-save", UserFunction.createPoBog);
router.delete("/po-bog", UserFunction.deletePoBog);

// User SAP (Mở khóa tài khoản)
router.post("/getUser", UserFunction.getUserSAP);
router.post("/unlockUser", UserFunction.unlockUserSAP);
// new
router.post("/user-sap", UserFunction.getUserSAP);
router.post("/user-sap-unlock", UserFunction.unlockUserSAP);

// Kỳ kế toán
router.post("/getAccounting", UserFunction.getAccountingPeriod);
router.post("/unlockAccounting", UserFunction.saveAccountingPeriod);
// new
router.post("/accounting-period", UserFunction.getAccountingPeriod);
router.post("/accounting-period-save", UserFunction.saveAccountingPeriod);

// Kỳ kho
router.post("/getWarehouse", UserFunction.getWarehousePeriod);
router.post("/unlockWarehouse", UserFunction.saveWarehousePeriod);
// new
router.post("/warehouse-period", UserFunction.getWarehousePeriod);
router.post("/warehouse-period-save", UserFunction.saveWarehousePeriod);

// Sản lượng doanh thu
router.post("/quantityRevenue", UserFunction.getQuantityRevenue);
//new
router.post("/quantity-revenue", UserFunction.getQuantityRevenue);

// Xuất âm tồn kho
router.post("/getNegative", UserFunction.getNegativeInventory);
router.post("/handleNegative", UserFunction.saveNegativeInventory);
// new 
router.post("/negative-inventory", UserFunction.getNegativeInventory);
router.post("/negative-inventory-switch", UserFunction.saveNegativeInventory);

// Config thời gian tích hợp Egas
router.post("/kyEgas", UserFunction.getEgasIntegrateTimeCf);
router.post("/saveKyEgas", UserFunction.saveEgasIntegrateTimeCf);
// new
router.post("/egas-integrate-timecf", UserFunction.getEgasIntegrateTimeCf);
router.post("/egas-integrate-timecf-save", UserFunction.saveEgasIntegrateTimeCf);

// Company Code config DO chuyển thẳng
router.post("/ccode-config-transfer-ct", UserFunction.getCcodeConfigTransferCT);
router.post("/ccode-config-transfer-ct-save", UserFunction.saveCcodeConfigTransferCT);

module.exports = router;
