let db = require('../../dao/mysqlDB');
/*********************手机端************************************* */
//添加回复
exports.insertHuiFu=(req,res)=>{
    let sql = 'INSERT INTO tb_forum_comment(forum_id, user_id, create_time, comment) VALUES(?,?,now(),?)';
    let sqlParams = [req.body.forumId,req.body.userId,req.body.comment];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "插入成功" });
        }else{
            res.send({ status: "1", massage: "插入失败" });
        }
    })
}
//查看当前帖子的所有回复
exports.findForumCommentById=(req,res)=>{
    let sql = 'SELECT  u.username,f.comment,f.create_time  FROM tb_user u LEFT JOIN tb_forum_comment f on u.id = f.user_id WHERE f.forum_id =?';
    let sqlParams = [req.body.ForumId];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result});
    })
}