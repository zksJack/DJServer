let express = require("express");
let reportService = require("../../service/report/report");
let expressJoi = require('@escook/express-joi');
let Router = express.Router();
Router.post("/pageQuery",reportService.pageQuery);
Router.post("/selectById",reportService.selectById);
Router.post("/updateAccept",reportService.updateAccept);
Router.post("/batchAccept",reportService.batchAccept);
module.exports =Router