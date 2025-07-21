const express = require('express');
const routerPhienDauGia = express.Router();
const phiendauGiaController = require('../controller/phiendaugiaController');

routerPhienDauGia.get('/chitietphiendaugia', phiendauGiaController.xemchitietphiendaugia);
routerPhienDauGia.get('/loctrangthai', phiendauGiaController.timSPCoPhiendaugiatheotrangthai);
routerPhienDauGia.get('/timsp', phiendauGiaController.timSPCoPhiendaugia);
routerPhienDauGia.get('/xempdg', phiendauGiaController.layPhienDauGia);
routerPhienDauGia.get('/getgmail', phiendauGiaController.getGmail);
routerPhienDauGia.put('/capnhatpdg',phiendauGiaController.updatepdg);

module.exports = routerPhienDauGia;