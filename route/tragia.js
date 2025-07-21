const express = require('express');
const routerTragia = express.Router();

const tragiaController = require('../controller/tragiaController');
const tokenVerify = require('../middleware/verifytoken');

routerTragia.get('/xuatgiatratrongphien', tokenVerify, tragiaController.xuatgiatratrongphien);
routerTragia.get('/xuatallnguoitragiatrongphien', tokenVerify, tragiaController.xuatallnguoitragiatrongphien);
routerTragia.post('/tragiatrongphien', tokenVerify, tragiaController.tragiatrongphien);
module.exports = routerTragia;