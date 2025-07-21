const express = require('express');
const routerTimeSet = express.Router();
const timesetController = require('../controller/timesetController');

// Route: GET /api/thoigianbatdau?idphiendg=...
routerTimeSet.get('/thoigianbd', timesetController.getStartTime);

module.exports = routerTimeSet;
