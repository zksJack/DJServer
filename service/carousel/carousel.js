let mysql = require('mysql');
let db = require('../../dao/mysqlDB');
//轮播图列表（分页）
exports.pageQuery = (req, res) => {
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_carousel ORDER BY create_time desc lIMIT ?,?';
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        else {
            var sql1 = "SELECT FOUND_ROWS() as count"
            db.query(sql1, function (err, total) {
                res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
            })
        }
    });
}
//根据id删除轮播
exports.deleteByID = (req, res) => {
    let sql = '	DELETE FROM tb_carousel WHERE id = ?';
    let sqlParams = [req.body.carouselId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) 
            res.send({ status: "0", massage: "删除成功" });
        else 
            res.send({ status: "0", massage: "删除失败" });
    })
}
//更新轮播信息
exports.updateById = (req, res) => {
    let sql = 'update tb_carousel set title = ?,url = ?, img_url = ?, priority = ?,type = ?,status = ?,create_time = now() WHERE id = ?';
    let sqlParams = [
        req.body.title,
        req.body.url,
        req.body.img_url,
        parseInt(req.body.priority),
        parseInt(req.body.type),
        parseInt(req.body.status),
        req.body.carouselId
    ];
    db.query(sql, sqlParams, function (err, result) {
        if (err)  
            return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) 
            res.send({ status: "0", massage: "更改成功" });
        else 
            res.send({ status: "0", massage: "更改失败" });
    })
}
//批量删除
exports.batchDelete = (req, res) => {
    let sqlParams = [];
    let values = req.body.carouselsIds;
    values.forEach((item, index) => {
        sqlParams.push([item.id]);
    })
    //查询语句拼接
    let modelsql = "DELETE FROM tb_carousel WHERE id = ?";
    let sql = '';
    sqlParams.forEach((item, index) => {
        sql += mysql.format(modelsql, item) + ";";
    })
    db.query(sql, function (err, result) {
        if (err) 
            return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows)
            res.send({ status: "0", massage: "删除成功" });
        else 
            res.send({ status: "0", massage: "删除失败" });
    })
}
//
//插入轮播信息
exports.insertById = (req, res) => {
    let sql = 'INSERT INTO tb_carousel(id,title,url, img_url, priority ,type,status ,create_time) VALUES(?,?,?,?,?,?,?,now())';
    let sqlParams = [
        req.body.carouselId,
        req.body.title,
        req.body.url,
        req.body.img_url,
        req.body.priority,
        req.body.type,
        req.body.status
    ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) 
            return res.send({ status: "3306", massage: err.message });
        if (result[0].affectedRows || result.affectedRows ) 
            res.send({ status: "0", massage: "插入成功" });
        else 
            res.send({ status: "0", massage: "插入失败" });
    })
}