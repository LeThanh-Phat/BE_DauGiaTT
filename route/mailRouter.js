const express = require('express');
const router = express.Router();
const { sendTestMail } = require('../controller/mailController');

router.post('/test-email', sendTestMail);

module.exports = router;
