const express = require('express');
const routerHinhAnh = express.Router();
const upload = require('../middleware/upload');
const hinhAnhController = require('../controller/hinhAnhController');

routerHinhAnh.get('/xemha', hinhAnhController.layDanhSachHinhAnh);
routerHinhAnh.post('/themha', upload.array('images', 10), hinhAnhController.themHinhAnh);
module.exports = routerHinhAnh;