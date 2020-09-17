let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
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
        sql = 'SELECT SQL_CALC_FOUND_ROWS username,id_card,phone,total_score,disabled FROM tb_user limit ?,?'
        :
        sql = 'SELECT SQL_CALC_FOUND_ROWS username,id_card,phone,total_score,disabled FROM tb_user'
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) throw err;
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
exports.getUserInfo = (req, res) => {
    let sql = "SELECT u.id,username,phone,nation,wx_num,qq_num,age,sex,total_score,education,job_rank,join_party_time,u.disabled,c.branch_name FROM tb_user u ,tb_coordinate c WHERE username = ? and u.branch_id = c.branch_id"
    let sqlParams = [req.body.username];
    db.query(sql, sqlParams, function (err, result) {
        if (err) throw err;
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//禁用或者恢复
exports.operationState = (req, res) => {
    let sql = "UPDATE tb_user SET disabled = ? WHERE username =?"
    let sqlParams = [req.body.disabled, req.body.username]
    db.query(sql, sqlParams, function (err, result) {
        if (err) throw err;
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }
    })
}
//重置密码
exports.resetPWD = (req, res) => {
    let sql = "UPDATE tb_user SET password = ? WHERE username =?"
    let password = bcryptjs.hashSync("123456", 10);
    let sqlParams = [password, req.body.username]
    db.query(sql, sqlParams, function (err, result) {
        if (err) throw err;
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }
    })
}
exports.getUserByName = (req, res) => {
    let sql = "SELECT username,id_card,phone,total_score,disabled FROM tb_user WHERE username LIKE ?"
    let str = '%' + req.body.username + '%'
    let sqlParams = [str];
    db.query(sql, sqlParams, function (err, result) {
        if (err) throw err;
        res.send({ status: "0", massage: "查询成功", data: result });
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
        if (err) throw err;
        console.log(result);
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
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
        return res.send({ status: "222", massage: "文件为空" });
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
        return res.send({ status: "333", massage: "数据有空，请检查" });
    } else {  //批量插入
        let sql = `INSERT INTO tb_user(username,password,id_card,phone,header,nation,branch_id,wx_num,qq_num,age,sex,total_score,party_status,birthday,special,education,job_rank,hometown,address,join_party_time,lead_person,salary,last_pay_time,disabled) VALUES ?`
        db.query(sql, [sqlParams], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.affectedRows) {
                res.send({ status: "0", massage: "导入成功" });
            }
        })
    }
    //  return res.json(sqlParams);
}