let express = require("express");
let integralService = require('../../service/integral/integral');
let expressJoi = require('@escook/express-joi');

let {intergral_schema,intergral_rule_schema} = require('../../shema/integral/integral')
let Router = express.Router();

Router.post("/getAllRule",integralService.getAllRule);
Router.post("/getRuleInfo",integralService.getRuleInfo);
Router.post("/insertRule",integralService.insertRule);
Router.post("/updateById",expressJoi(intergral_rule_schema),integralService.updateById);
Router.post("/deleteById",integralService.deleteById);
Router.post("/insertUserInfo",expressJoi(intergral_schema), integralService.insertUserInfo);
Router.post("/pageQueryAllUser",integralService.pageQueryAllUser);
Router.post("/updateUserJifen",integralService.updateUserJifen);
Router.post("/updateCurMax",integralService.updateCurMax);

module.exports =Router