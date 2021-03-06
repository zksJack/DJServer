//DOTO 项目二级路由
let express = require("express");
//配置multer解析表单数据
let multer = require('multer');
let path = require('path');
let upload = multer({dest:path.join(__dirname,"../../uploads")})
//导入数据校验中间件
let expressJoi = require('@escook/express-joi');
let newsService = require("../../service/news/news");

let {up_news_Info_schema,in_news_Info_schema} = require("../../shema/news/news");
/***没有加数据验证 后期补充 */
let Router = express.Router();
Router.get("/getAllNewsTypes",newsService.getAllNewsTypes);
Router.post("/getAllNews",newsService.getAllNews);
Router.post("/getNewsById",newsService.getNewsById);
Router.post("/deleteNewsById",newsService.deleteNewsById);
Router.post("/updateNewsById",upload.single('pic'),expressJoi(up_news_Info_schema),newsService.updateNewsById);
Router.post("/insertNews",upload.single('pic'),expressJoi(in_news_Info_schema),newsService.insertNews);
module.exports =Router