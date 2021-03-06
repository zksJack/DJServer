let express = require("express");
let Joi = require("@hapi/joi");             //优雅的数据验证
let bodyParser = require("body-parser");    //body-paser解析表单提交的数据
let cors = require("cors");                 //跨域
let expressJWT = require("express-jwt");    //跨域token鉴权 解析token
let config = require('./config');            //jwt配置
let path = require("path");
let app = express();
let fs = require('fs')
// 配置跨域
app.use(cors());
// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//托管静态资源
app.use("/uploads",express.static(path.join(__dirname,"uploads")));
// 配置token 验证权限
//配置express-jet中间件 res.user可以获取 unless过滤路由  
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/admin\//,/^\/uploads\//]})); //unless 过滤不需要验证的路由
//引入一级路由
let userController = require("./controller/user/user");
let adminController = require("./controller/admin/login");
let newsController = require("./controller/news/news");
let carouselController = require("./controller/carousel/carousel");
let commentController = require("./controller/comment/comment");
let forumController = require("./controller/forum/forum");
let reportController = require("./controller/report/report");
let noticeController = require("./controller/notice/notice");
let integralController = require("./controller/integral/integral");
let operationController = require('./controller/admin/operation')
app.get("/hello", (req, res) => {  //测试路由
    res.send("欢迎");
})
app.use("/user", userController);
app.use("/admin",adminController);
app.use("/news",newsController);
app.use("/carousel",carouselController);
app.use("/comment",commentController);
app.use("/forum",forumController);
app.use("/report",reportController);
app.use("/notice",noticeController);
app.use("/integral",integralController);
app.use("/operation",operationController);

//错误处理中间件
app.use((err, req, res, next) => {
   // console.log(req.file);
    if(req.file){  //如果出错先把图片文件删了
        try {
            fs.unlinkSync(path.join(req.file.destination,req.file.filename));
        } catch (error) {
            console.log("图片没有");
        }
    }
    if (err instanceof Joi.ValidationError) {
        return res.send({status:"3300",massage:err.message});
    }
    if (err.name === "UnauthorizedError") {
        return res.send({status:"3",massage:"身份验证失败"});
    }
    res.send({status:"4040",massage:"未知错误"+ err})
})
//配置项目端口
app.listen(4000, () => {
    console.log("DJ项目已启动");
})