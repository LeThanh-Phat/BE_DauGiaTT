const express = require('express');
const routerDangkyphien = express.Router();
const dangkyphienController = require('../controller/dangkyphienController');

routerDangkyphien.post('/taodkphien', dangkyphienController.taodangkyphien);
routerDangkyphien.get('/checkdkphien', dangkyphienController.checkdkphien);
routerDangkyphien.get('/countdkphien', dangkyphienController.countdkphien);
routerDangkyphien.get('/getinfo',dangkyphienController.infodkphien);

module.exports = routerDangkyphien;