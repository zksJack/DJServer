let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
let path = require('path');
//查看思想汇报
exports.pageQuery = (req, res) => {
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS r.id,r.user_id,r.create_time,r.type,r.is_accept,r.reason,u.username FROM tb_report r,tb_user u WHERE r.user_id = u.id AND istype= ? ORDER BY create_time desc LIMIT ?,?';
    let sqlParams = [req.body.istype, m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
//查询思想汇报
exports.selectById = (req, res) => {
    let sql = 'SELECT p.pic_url FROM tb_report r,tb_picture p WHERE r.id= p.link_id  AND r.id = ?';
    let sqlParams = [req.body.reportId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result});
    })
}


//更新思想汇报的审核状态
exports.updateAccept = (req, res) => {

    let sql = 'UPDATE tb_report SET type = ?,reason =? ,is_accept=? WHERE id =?';
    let sqlParams = [
            req.body.type, 
            req.body.reason, 
            req.body.reportId,
            req.body.type==1?1:2
        ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        } else {
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
        sqlParams.push([req.body.type==1?1:2,req.body.type,item.id]);
    })
    //查询语句拼接
    let modelsql = "UPDATE tb_report SET is_accept = ?,type = ? WHERE id =?";
    let sql = '';
    sqlParams.forEach((item, index) => {
        sql += mysql.format(modelsql, item) + ";"
    })
    db.query(sql, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows || result[0].affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        } else {
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
/***************************手机端********************************* */
//插入思想报告信息
exports.insertReport = (req, res) => {
    let files = req.files;
    if (files.length === 0) {
        return res.send({ status: '1', massage: "图片不能为空" });
    } else {
        //先插一条汇报数据
        let sql = 'INSERT INTO tb_report (user_id,create_time,type,is_accept,istype) values(?,now(),0,0,?)';
        let sqlParams = [req.body.userID, parseInt(req.body.istype)]
        db.query(sql, sqlParams, function (err, result) {
            if (err) return res.send({ status: "3306", massage: err.message });
            if (result.affectedRows) {
                console.log("1");
                //批量导入图片
                let sqlb = 'INSERT INTO tb_picture(pic_url,link_id) VALUES ?';
                let sqlParamsb = [];
                for (var i in files) {
                    let file = files[i];
                    let fileInfo = [path.join("/uploads", file.filename), result.insertId];
                    sqlParamsb.push(fileInfo);
                }
                console.log(sqlParamsb);
                db.query(sqlb, [sqlParamsb], function (err, result) {
                    if (err) return res.send({ status: "3306", massage: err.message });
                    console.log(result);
                    if (result.affectedRows || result[0].affectedRows) {
                        res.send({ status: "0", massage: "插入成功" });
                    } else {
                        res.send({ status: "1", massage: "插入失败" });
                    }
                })
            } else {
                res.send({ status: "1", massage: "主插入失败" });
            }
        })
    }
}
//查询审核状态
exports.selectAccept = (req, res) => {
    let sql = 'SELECT type FROM tb_report WHERE user_id=? AND istype=?';
    let sqlParams = [req.body.userID, req.body.istype];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0]});
    })
}
