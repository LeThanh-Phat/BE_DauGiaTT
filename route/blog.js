const express = require('express');
const routerBlog = express.Router();
const blogController = require('../controller/blogController');

routerBlog.get('/xemtt', blogController.xemBlog);
routerBlog.post('/themtt', blogController.themtintuc);
routerBlog.put('/suatt', blogController.suatintuc);
routerBlog.get('/xoatt', blogController.xoatintuc);
module.exports = routerBlog;