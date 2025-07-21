const express = require('express');
const routerDanhMuc = express.Router();
const danhMucController = require('../controller/danhmucController');

routerDanhMuc.get('/xemdm', danhMucController.layDanhMuc);
routerDanhMuc.post('/themdm', danhMucController.themDanhMuc);
routerDanhMuc.put('/suadm', danhMucController.suaDanhMuc);
routerDanhMuc.get('/timdm', danhMucController.timDanhMuc);
module.exports = routerDanhMuc;