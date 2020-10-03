let express = require("express");
let reportService = require("../../service/report/report");
let expressJoi = require('@escook/express-joi');
let {up_Accept_schema} = require('../../shema/report/report')
//配置multer解析表单数据
let multer = require('multer');
let path = require('path');
let upload = multer({dest:path.join(__dirname,"../../uploads")})
let Router = express.Router();
Router.post("/pageQuery",reportService.pageQuery);
Router.post("/selectById",reportService.selectById);
Router.post("/updateAccept",expressJoi(up_Accept_schema),reportService.updateAccept);
Router.post("/batchAccept",reportService.batchAccept);


module.exports =Router