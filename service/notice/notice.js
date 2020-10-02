let db = require('../../dao/mysqlDB');
/****************************手机端 ****************************/
//查询所有通知
exports.pageQuery=(req,res)=>{
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_notice ORDER BY create_time desc LIMIT ?,?';
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
//查询通知信息
exports.getNoticeInfo=(req,res)=>{
    let sql = 'SELECT * FROM tb_notice WHERE notice_id = ? ';
    let sqlParams = [req.body.noticeId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//更新通知
exports.updateById=(req,res)=>{
    let sql = 'UPDATE tb_notice SET title = ?, create_time =now(), content =? WHERE notice_id =?';
    let sqlParams = [req.body.title,req.body.content,req.body.noticeId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}
//插入通知
exports.insertNotice=(req,res)=>{
    let sql = 'INSERT INTO tb_notice (title, create_time, content) VALUES(?,now(),?)';
    let sqlParams = [req.body.title,req.body.content];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "插入成功" });
        }else{
            res.send({ status: "1", massage: "插入失败" });
        }
    })
}
//删除通知
exports.deleteById=(req,res)=>{
    let sql = "DELETE FROM tb_notice WHERE notice_id = ?"
    let sqlParams = [req.body.noticeId]
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows)
            res.send({ status: "0", massage: "删除成功" });
        else {
            res.send({ status: "1", massage: "删除失败" });
        }
    })
}
//