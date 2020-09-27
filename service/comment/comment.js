let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
//分页查询
exports.pageQuery =(req,res)=>{
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_comment ORDER BY create_time DESC LIMIT ?,?';
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err)  res.send({ status: "3306", massage: err.message });
        else{
            var sql1 = "SELECT FOUND_ROWS() as count"
            db.query(sql1, function (err, total) {
                res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
            })
        }
    });
}
//根据id获取信息
exports.selectById =(req,res)=>{
    let sql = 'SELECT id, create_time, title_desc, is_open,content FROM tb_comment WHERE id = ?';
    let sqlParams = [req.body.commentID];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}

//更新状态 根据id
exports.updateStatus=(req,res)=>{
    let sql = 'UPDATE tb_comment SET is_open = ? WHERE id = ?';
    let sqlParams = [req.body.is_open,req.body.commentID];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })
}

//查询现在是否有正在进行的民主评议
exports.selectIsCommenting =(req,res)=>{
    let sql = '';
    let sqlParams = [];
}

//修改信息根据ID
exports.updateById=(req,res)=>{
    let sql = 'UPDATE tb_comment SET content=?, title_desc =?,is_open = ? WHERE id = ?';
    let sqlParams = [req.body.content,req.body.title_desc,req.body.is_open,req.body.commentID];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "更改成功" });
        }else{
            res.send({ status: "1", massage: "更改失败" });
        }
    })

}
//修改信息根据ID
exports.inserCommen=(req,res)=>{
    let sql = 'INSERT INTO tb_comment(id,create_time,content, title_desc,is_open) VALUES (?,now(),?,?,1)';
    let sqlParams = [req.body.commentID,req.body.content,req.body.title_desc];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "插入成功" });
        }else{
            res.send({ status: "1", massage: "插入失败" });
        }
    })

}