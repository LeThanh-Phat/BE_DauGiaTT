const express = require('express');
const routerAPI = express.Router();
const userController = require('../controller/userController');
const verifyToken = require('../middleware/verifytoken');

routerAPI.post('/dangky', userController.dangky);
routerAPI.post('/dangnhap', userController.dangnhap);


routerAPI.get('/load', verifyToken, userController.load);
routerAPI.put('/capnhatTT', verifyToken, userController.capnhatTT);
routerAPI.put('/doimatkhau', verifyToken, userController.doimatkhau);
module.exports = routerAPI;
