const express = require('express');
const routerSanPham = express.Router();
const sanPhamController = require('../controller/sanphamController');

routerSanPham.get('/timkiem', sanPhamController.timkiem);
routerSanPham.get('/loc', sanPhamController.locSanPham);
routerSanPham.post('/taosp',sanPhamController.taosp);
routerSanPham.get('/xemsp',sanPhamController.xemsp);
module.exports = routerSanPham;