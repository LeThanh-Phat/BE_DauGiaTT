const express = require('express');
const routerSocket = express.Router();

// Có thể có các route REST hỗ trợ WebSocket nếu cần
routerSocket.get('/ping', (req, res) => {
  res.send('WebSocket is ready!');
});

module.exports = routerSocket;
