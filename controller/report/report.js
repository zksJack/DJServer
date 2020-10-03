let express = require("express");
let reportService = require("../../service/report/report");
let expressJoi = require('@escook/express-joi');
let {in_report_schema,updateAccept_schema,batchAccept_schema} = require('../../shema/report/report')
//配置multer解析表单数据
let multer = require('multer');
let path = require('path');
let upload = multer({dest:path.join(__dirname,"../../uploads")})
let Router = express.Router();
Router.post("/pageQuery",reportService.pageQuery);
Router.post("/selectById",reportService.selectById);
Router.post("/updateAccept",expressJoi(updateAccept_schema),reportService.updateAccept);
Router.post("/batchAccept",expressJoi(batchAccept_schema),reportService.batchAccept);
Router.post("/insertReport",upload.array('files',5),expressJoi(in_report_schema),reportService.insertReport);
Router.post("/selectAccept",expressJoi(in_report_schema),reportService.selectAccept);
module.exports =Router