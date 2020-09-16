let db = require('../../dao/mysqlDB');
let jsonwebtoken = require("jsonwebtoken");//根据用户信息生成一个token
let config = require('../../config');            //jwt配置
let bcryptjs = require("bcryptjs");
//获取管理员的信息
exports.getAdminInfo = (req, res) => {
    //从数据库中拿数据扔到前端就ok  so easy
    let sql = 'SELECT * FROM user_manager WHERE username =? '
    let sqlparams = [req.query.username];
    db.query(sql, sqlparams, function (err, result) {
        if (err) throw err;
        if (!result[0]) {
            return res.send({ status: "1", massage: "用户不存在" });
        } else {
            if (bcryptjs.compareSync(req.query.password,result[0].password)) {
                let user = {username:result[0].username}
                let tokenStr = jsonwebtoken.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn});
                return res.send({ status: "0", massage: "查询成功", token: tokenStr});
            } else {
                return res.send({ status: "1", massage: "密码错误" });
            }
        }
    });
}
exports.changePassword = (req, res) => {
    //从数据库中拿数据扔到前端就ok  so easy
    let sql = 'SELECT * FROM user_manager WHERE username =? '
    let sqlparams = [req.body.username];
    db.query(sql, sqlparams, function (err, result) {
        if (err) throw err;
        if (!result[0]) {
            return res.send({ status: "1", massage: "用户不存在" });
        } else {
            if (bcryptjs.compareSync(req.body.password,result[0].password)){
                let csql = "UPDATE user_manager SET password = ? WHERE username =?";
                let newpassword =  bcryptjs.hashSync(req.body.newpassword,10);
                let csqlparams = [newpassword,req.body.username];
                db.query(csql, csqlparams, function (err, result) {
                    if (err) throw err;
                    if(result.affectedRows){
                        return res.send({ status: "0", massage: "修改密码成功" });
                    }
                });
            } else {
                return res.send({ status: "1", massage: "密码错误" });
            }
        }
    });
}