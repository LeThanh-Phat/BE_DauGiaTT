const express = require('express');
const routerAPI = express.Router();
const adminController = require('../controller/adminController');
const verifyToken = require('../middleware/verifytoken');

routerAPI.post('/dangky-ad', adminController.dangky);
routerAPI.post('/dangnhap-ad', adminController.dangnhap);
routerAPI.get('/gettk',adminController.layAllTK);

routerAPI.get('/load-ad', verifyToken, adminController.load);
routerAPI.put('/capnhatTT-ad', verifyToken, adminController.capnhatTT);
routerAPI.put('/doimatkhau-ad', verifyToken, adminController.doimatkhau);

routerAPI.put('/duyetsp',adminController.duyetSanPham);
routerAPI.put('/huysp',adminController.huyDuyetSanPham);
routerAPI.put('/duyetphien',adminController.DuyetPhienDauGia);
routerAPI.put('/huyphien',adminController.HuyPhienDauGia);


module.exports = routerAPI;
