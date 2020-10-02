let express = require("express");
let notiveService = require("../../service/notice/notice");
let expressJoi = require('@escook/express-joi');
let Router = express.Router();

Router.post("/pageQuery",notiveService.pageQuery);
Router.post("/getNoticeInfo",notiveService.getNoticeInfo);
Router.post("/updateById",notiveService.updateById);
Router.post("/insertNotice",notiveService.insertNotice);
Router.post("/deleteById",notiveService.deleteById);
module.exports =Router