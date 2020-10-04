let mysql = require('mysql');
let db = require('../../dao/mysqlDB');

//分页获取所有的帖子
exports.pageQueryList=(req,res)=>{
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS t.*, COUNT(c.user_id) as num FROM tb_forum t LEFT JOIN tb_forum_comment c ON t.forum_id = c.forum_id GROUP BY t.create_time limit ?,?';  //num 表示当前帖子的回复总数
    let sqlParams = [m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            if (err) throw err;
            res.send({status:"0",massage:"查询成功",total:total[0].count,data:result});
        })
    })
}
//根据id查询帖子
exports.findForumById=(req,res)=>{
    let sql = 'SELECT * FROM tb_forum WHERE forum_id = ?';
    let sqlParams = [req.body.ForumId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0]});
    })
}
//根据id删除帖子
/***
 *  帖子删除的同时要把当前帖子的所有回复都删了
 * 
 */
exports.deleteForumById=(req,res)=>{
    let sql = '';
    let sqlmodel = 'DELETE FROM  tb_forum WHERE forum_id = ?';
    let modelsql1 = "DELETE FROM tb_forum_comment WHERE forum_id = ?";
    let sqlParams = [req.body.ForumId];  

    sql += mysql.format(sqlmodel, sqlParams) + ";";
    sql += mysql.format(modelsql1, sqlParams) + ";";
    db.query(sql, sqlParams, function (err, result) {
       if (err) return res.send({ status: "3306", massage: err.message });
       if(result[0].affectedRows)        
            res.send({ status: "0", massage: "删除成功" });
       else{
            res.send({ status: "1", massage: "删除失败" });
        }
    }) 

}
//批量删除(根据id)
exports.batchDelete = (req, res) => {
    //数据库字段有几项必填项 一条语句不适合
    // let sql = "insert into tb_user(id,password) values ? on duplicate key update password = values(password)";

    let sqlParams = [];
    let values = req.body.forumIds;
    values.forEach((item, index) => {
        sqlParams.push([item.id]);
    })
    //查询语句拼接
    let modelsql = "DELETE FROM tb_forum WHERE forum_id = ?";
    let modelsql1 = "DELETE FROM tb_forum_comment WHERE forum_id = ?";
    let sql = '';
    sqlParams.forEach((item, index) => {
        sql += mysql.format(modelsql, item) + ";";
        sql += mysql.format(modelsql1, item) + ";";
    })
    
    db.query(sql, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        
        if (result[0].affectedRows || result.affectedRows ){
            res.send({ status: "0", massage: "删除成功" });
        }else{
            res.send({ status: "1", massage: "删除失败" });
        }
    })
}
/*******************手机端************* */
exports.insertForum=(req,res)=>{
    let sql = 'INSERT INTO tb_forum(user_id,username,create_time,is_priv,content,type) VALUES(?,?,NOW(),0,?,?)';
    let sqlParams = [
        req.body.userId,
        req.body.username,
        req.body.content,
        req.body.type,
    ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if ( result.affectedRows ){
            res.send({ status: "0", massage: "添加成功" });
        }else{
            res.send({ status: "1", massage: "添加失败" });
        }
    })
}
