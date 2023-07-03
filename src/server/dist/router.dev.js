"use strict";

var express = require('express');

var router = express.Router();

var services = require('./services.js'); // 获取产品全部数据


router.post('/api/productList', services.productList); // 获取产品详情数据

router.post('/api/productDetail', services.productDetail); // 获取用户列表

router.post('/api/userList', services.userList);
router.post('/api/start', services.start); // 登录功能

router.post('/api/login', services.login); // 注册功能

router.post('/api/register', services.register); // 验证token

router.post('/api/loginStatus', services.loginStatus); // 上传图片

router.post('/api/upLoadImg', services.upLoadImg); //报错产品图片

router.post('/api/productAddImg', services.productAddImg); //获取产品尺码表

router.post('/api/productSizes', services.productSizes);
module.exports = router;