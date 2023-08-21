const express = require('express')
const router = express.Router()
const services = require('./services.js')

// 获取产品全部数据
router.post('/api/productList', services.productList)
// 获取产品详情数据
router.post('/api/productDetail', services.productDetail)
// 获取用户列表
router.post('/api/userList', services.userList)

router.post('/api/start', services.start)
// 登录功能
router.post('/api/login', services.login)
// 注册功能
router.post('/api/register', services.register)
// 验证token
router.post('/api/loginStatus', services.loginStatus)
// 上传图片
router.post('/api/upLoadImg', services.upLoadImg)
//报错产品图片
router.post('/api/productAddImg', services.productAddImg)
//获取产品尺码表
router.post('/api/productSizes', services.productSizes)
//保存
router.post('/api/saleProductSizes', services.saleProductSizes)
//获取banner列表
router.post('/api/bannerList', services.bannerList)
//获取banner详细
router.post('/api/bannerDetail', services.bannerDetail)
//创建banner
router.post('/api/bannerCreate', services.bannerCreate)
//修改banner
router.post('/api/changeBanner', services.changeBanner)
//删除广告位
router.post('/api/delateBanner', services.delateBanner)
//获取勾选位列表
router.post('/api/catalogList', services.catalogList)
//获取勾选位详细
router.post('/api/catalogDetail', services.catalogDetail)
//创建勾选位
router.post('/api/catalogCreate', services.catalogCreate)
//修改勾选位
router.post('/api/changeCatalog', services.changeCatalog)
//勾选位获取产品数据
router.post('/api/getProductsList', services.getProductsList)
//勾选位添加产品
router.post('/api/addProductOfCatalog', services.addProductOfCatalog)
//删除勾选位
router.post('/api/delateCatalogList', services.delateCatalogList)
//获取分类列表
router.post('/api/getCategoryList', services.getCategoryList)
//获取用户列表
router.post('/api/getUserList', services.getUserList)
//获取订单列表
router.post('/api/getOrderList', services.getOrderList)

module.exports = router