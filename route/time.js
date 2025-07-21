const express = require('express');
const routerTime = express.Router();
const { getCurrentTime } = require('../controller/timeController');

routerTime.get('/now', getCurrentTime);

module.exports = routerTime;
