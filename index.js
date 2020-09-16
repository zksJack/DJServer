let express = require("express");
let Joi = require("@hapi/joi");             //优雅的数据验证
let bodyParser = require("body-parser");    //body-paser解析表单提交的数据
let cors = require("cors");                 //跨域
let expressJWT = require("express-jwt");    //跨域token鉴权 解析token
let config = require('./config');            //jwt配置
let jsonwebtoken = require("jsonwebtoken");//根据用户信息生成一个token
let app = express();
// 配置跨域
app.use(cors());
// 配置body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// 配置token 验证权限
//配置express-jet中间件 res.user可以获取 unless过滤路由  
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/admin\//]})); //unless 过滤不需要验证的路由
//引入一级路由
let userController = require("./controller/user/user");
let adminController = require("./controller/admin/login");

app.get("/hello", (req, res) => {  //测试路由
    res.send("欢迎");
})
app.use("/user", userController)
app.use("/admin",adminController)
//错误处理中间件
app.use((err, req, res, next) => {
    if (err instanceof Joi.ValidationError) {
        return res.send({status:"1",massage:err.message});
    }
    if (err.name === "UnauthorizedError") {
        return res.send({status:"3",massage:"身份验证失败"});
    }
    res.send({status:"2",massage:"未知错误"+err})
})
//配置项目端口
app.listen(3000, () => {
    console.log("DJ项目已启动");
})