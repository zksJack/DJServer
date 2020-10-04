//DOTO 项目二级路由
let express = require("express");
let operationService = require("../../service/admin/operation");
let Router = express.Router();
Router.post("/selectAllURL",operationService.selectAllURL);
module.exports=Router;