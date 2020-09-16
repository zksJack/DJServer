//DOTO 项目二级路由
let express = require("express");
//导入数据校验中间件
let expressJoi = require('@escook/express-joi');
// 引入controller的逻辑处理函数
let loginService = require("../../service/admin/login");
//导入校验规则对象
let {admin_login_schema,admin_changePassword_schema} = require("../../shema/admin/login");
let Router = express.Router();

Router.get("/login",expressJoi(admin_login_schema),loginService.getAdminInfo);
Router.post("/changePassword",expressJoi(admin_changePassword_schema),loginService.changePassword);
module.exports =Router;
