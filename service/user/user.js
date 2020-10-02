let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
let jsonwebtoken = require("jsonwebtoken");//根据用户信息生成一个token
let config = require('../../config');            //jwt配置
let bcryptjs = require("bcryptjs");
let xlsx = require('xlsx')
//获取所有用户信息
exports.getAllUserInfo = (req, res) => {
    //从数据库中拿数据扔到前端就ok  so easy
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = '';
    page && limit ?
        sql = 'SELECT SQL_CALC_FOUND_ROWS id,username,id_card,phone,total_score,disabled FROM tb_user limit ?,?'
        :
        sql = 'SELECT SQL_CALC_FOUND_ROWS id,username,id_card,phone,total_score,disabled FROM tb_user'
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
//
exports.getUserInfo = (req, res) => {
    let sql = "SELECT u.id,username,phone,nation,wx_num,qq_num,age,sex,total_score,education,job_rank,join_party_time,u.disabled,c.branch_name FROM tb_user u ,tb_coordinate c WHERE u.id = ? and u.branch_id = c.branch_id"
    let sqlParams = [req.body.userID];
    console.log(sqlParams);
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//禁用或者恢复
exports.operationState = (req, res) => {
    let sql = "UPDATE tb_user SET disabled = ? WHERE id =?"
    let sqlParams = [req.body.disabled, req.body.userID]
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//重置密码
exports.resetPWD = (req, res) => {
    let sql = "UPDATE tb_user SET password = ? WHERE id =?"
    let password = bcryptjs.hashSync("123456", 10);
    let sqlParams = [password, req.body.userID]
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//模糊查询 
exports.getUserByName = (req, res) => {
    let sql = "SELECT id,username,id_card,phone,total_score,disabled FROM tb_user WHERE username LIKE ?"
    let str = '%' + req.body.username + '%'
    let sqlParams = [str];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        res.send({ status: "0", massage: "查询成功", data: result});
    })
}
//批量重置密码(根据id)
exports.batchReset = (req, res) => {
    //数据库字段有几项必填项 条语句不适合
    // let sql = "insert into tb_user(id,password) values ? on duplicate key update password = values(password)";

    let sqlParams = [];
    let values = req.body.userIDs;
    let password = bcryptjs.hashSync("123456", 10);
    values.forEach((item, index) => {
        sqlParams.push([password, item.id]);
    })
    //查询语句拼接
    let modelsql = "UPDATE tb_user SET password = ? WHERE id =?";
    let sql = '';
    sqlParams.forEach((item, index) => {
        sql += mysql.format(modelsql, item) + ";"
    })
    db.query(sql, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        if (result.affectedRows||result[0].affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//批量导入
exports.uploadExcel = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.json({ text: '请选择文件上传' })
    }
    const { originalname, buffer } = req.files[0]
    if (!originalname.endsWith('xls') && !originalname.endsWith('xlsx')) {
        return res.json({ text: '请上传xls或xlsx格式的文件' })
    }
    // 解析excel文件
    const workbook = xlsx.read(buffer, { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]] // 选择第一个工作簿
    const result = xlsx.utils.sheet_to_json(sheet)  //EXCEL转为json对象

    if (result == null) {
        return res.send({ status: "2222", massage: "文件为空" });
    }
    let sqlParams = [];
    let flag = true;
    try {
        result.forEach((item, index) => {
            let values = Object.values(item);
            console.log(values.length);
            if (values.length !== 24) {  //判断有没空数据
                flag = false;
                throw new Error("你他妈坑老子，有空")  //有错误跳出循环
            }
            sqlParams.push(values);//获取json对象的所有属性值=》Array
        })
    } catch {
        console.log("被坑了");
    }
    if (!flag) { //数据验证失败
        return res.send({ status: "3333", massage: "数据有空，请检查" });
    } else {  //批量插入
        let sql = `INSERT INTO tb_user(username,password,id_card,phone,header,nation,branch_id,wx_num,qq_num,age,sex,total_score,party_status,birthday,special,education,job_rank,hometown,address,join_party_time,lead_person,salary,last_pay_time,disabled) VALUES ?`
        db.query(sql, [sqlParams], function (err, result) {
            if (err) return res.send({ status: "3306", massage: err.message });
            console.log(result);
            if (result.affectedRows||result[0].affectedRows) {
                res.send({ status: "0", massage: "导入成功" });
            }else{
                res.send({ status: "1", massage: "导入失败" });
            }
        })
    }
    //  return res.json(sqlParams);
}

/**************** 手机端 *******************************/
//用户登录
exports.userLogin = (req, res) => {
    //从数据库中拿数据扔到前端就ok  so easy
    let sql = 'SELECT username,password FROM tb_user WHERE id_card =? '
    let sqlparams = [req.body.id_card];
    db.query(sql, sqlparams, function (err, result){
        if (err) throw err;
        if (!result[0]) {
            return res.send({ status: "1", massage: "用户不存在" });
        } else {
            if (bcryptjs.compareSync(req.body.password,result[0].password)) {
                let user = {username:result[0].username}
                let tokenStr = jsonwebtoken.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn});
                return res.send({ status: "0", massage: "查询成功", token: tokenStr});
            } else {
                return res.send({ status: "1", massage: "密码错误" });
            }
        }
    });
}
//修改密码
exports.updatePWD = (req, res) => {
    let sql1 = 'SELECT password FROM tb_user WHERE id_card= ?'
    let sqlParams1 = [req.body.id_card]
    db.query(sql1, sqlParams1, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result[0]) {
            if (bcryptjs.compareSync(req.body.oldPassword,result[0].password)){
                let sql = "UPDATE tb_user SET password = ? WHERE id_card =?"
                let newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
                let sqlParams = [newPassword, req.body.id_card]
                db.query(sql, sqlParams, function (err, result) {
                    if (err) return res.send({ status: "3306", massage: err.message });
                    if (result.affectedRows) {
                        res.send({ status: "0", massage: "更改成功" });
                    }else{
                        res.send({ status: "1", massage: "更改失败" });
                    }
                })
            }else{
                res.send({ status: "1", massage: "密码错误" });
            }
        }else{
            res.send({ status: "1", massage: "用户不存在" });
        }
    })
}
//更新个人信息
exports.updateUserInfo =(req,res)=>{
    let sql = 'UPDATE tb_user SET username=?,id_card=?,phone=?,nation=?,wx_num=?,qq_num=?,age=?,sex=?,birthday=?,education=?,job_rank=?,address=? WHERE id =?';
    let sqlParams = [
            req.body.username,
            req.body.id_card,
            req.body.phone,
            req.body.nation,
            req.body.wx_num,
            req.body.qq_num,
            req.body.age,
            req.body.sex,
            req.body.birthday,
            req.body.education,
            req.body.job_rank,
            req.body.address,
            req.body.userId
        ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//插入个人信息

