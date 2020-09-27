let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
//查看思想汇报
exports.pageQuery =(req,res)=>{
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS r.id,r.user_id,r.pic_id,r.create_time,r.type,r.is_accept,r.reason,u.username FROM tb_report r,tb_user u WHERE r.user_id = u.id  ORDER BY create_time desc LIMIT ?,?';
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
//查询思想汇报
exports.selectById =(req,res)=>{
    let sql = 'SELECT r.id,r.user_id,r.pic_id,r.create_time,r.type,r.is_accept,r.reason,u.username,u.phone,u.age,u.sex FROM tb_report r,tb_user u WHERE r.user_id = u.id  AND r.id = ?';
    let sqlParams = [req.body.reportId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//更新思想汇报的审核状态
exports.updateAccept =(req,res)=>{
    let sql = 'UPDATE tb_report SET is_accept = ?,reason =? WHERE id =?';
    let sqlParams = [req.body.is_accept,req.body.reason,req.body.reportId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//批量审核
exports.batchAccept = (req, res) => {
    //数据库字段有几项必填项 条语句不适合
    // let sql = "insert into tb_user(id,password) values ? on duplicate key update password = values(password)";

    let sqlParams = [];
    let values = req.body.reportIds;
    //let values = [{id:"0EBBE337EA13446186C5B0168FAE0EB6"}]
    values.forEach((item, index) => {
        sqlParams.push(['1',item.id]);
    })
    //查询语句拼接
    let modelsql = "UPDATE tb_report SET is_accept = ? WHERE id =?";
    let sql = '';
    sqlParams.forEach((item, index) => {
        sql += mysql.format(modelsql, item) + ";"
    })
    db.query(sql, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows || result[0].affectedRows ) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}


