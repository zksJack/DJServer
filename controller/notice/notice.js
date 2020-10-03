let express = require("express");
let notiveService = require("../../service/notice/notice");
let expressJoi = require('@escook/express-joi');
let {in_schema,up_schema} = require('../../shema/notice/notice')
let Router = express.Router();

Router.post("/pageQuery",notiveService.pageQuery);
Router.post("/getNoticeInfo",notiveService.getNoticeInfo);
Router.post("/updateById",expressJoi(up_schema),notiveService.updateById);
Router.post("/insertNotice",expressJoi(in_schema),notiveService.insertNotice);
Router.post("/deleteById",notiveService.deleteById);
module.exports =Router