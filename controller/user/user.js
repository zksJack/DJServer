//DOTO 项目二级路由
let express = require("express");
//导入数据校验中间件
let expressJoi = require('@escook/express-joi');
// 引入controller的逻辑处理函数
let userHandler = require("../../service/user/user");
//导入校验规则对象
let {user_shema} = require("../../shema/user/user");
let Router = express.Router();

Router.post("/one",expressJoi(user_shema),userHandler.one);
Router.get("/one",userHandler.two);

module.exports =Router;
