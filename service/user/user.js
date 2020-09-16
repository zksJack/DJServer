let db = require('../../dao/mysqlDB');
let bcryptjs = require("bcryptjs");
//获取所有用户信息
exports.getAllUserInfo = (req, res)=>{
    //从数据库中拿数据扔到前端就ok  so easy
    let page =  req.body.page||1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit*1;
    let m = (page-1)*limit;
    let sql = '';
    page&&limit?
      sql = 'SELECT SQL_CALC_FOUND_ROWS username,id_card,phone,total_score,disabled FROM tb_user limit ?,?'
    :
      sql = 'SELECT SQL_CALC_FOUND_ROWS username,id_card,phone,total_score,disabled FROM tb_user'
    let sqlParams = [m,limit];
    db.query(sql,sqlParams,function(err,result){
        if(err) throw err;
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({status:"0",massage:"查询成功",total:total[0].count,data:result});
        })   
    });
}
exports.getUserInfo = (req,res)=>{
    let sql ="SELECT u.id,username,phone,nation,wx_num,qq_num,age,sex,total_score,education,job_rank,join_party_time,u.disabled,c.branch_name FROM tb_user u ,tb_coordinate c WHERE username = ? and u.branch_id = c.branch_id"
    let sqlParams = [req.body.username];
    db.query(sql,sqlParams,function(err,result){
        if(err) throw err;
        res.send({status:"0",massage:"查询成功",data:result[0]});
    })
}
exports.operationState =(req,res)=>{
    let sql = "UPDATE tb_user SET disabled = ? WHERE username =?"
    let sqlParams =[req.body.disabled,req.body.username]
    db.query(sql,sqlParams,function(err,result){
        if(err) throw err;
        if(result.affectedRows){
            res.send({status:"0",massage:"更改成功"});
        }
    })
}
exports.resetPWD =(req,res)=>{
    let sql = "UPDATE tb_user SET password = ? WHERE username =?"
    let password =  bcryptjs.hashSync("123456",10);
    let sqlParams =[password,req.body.username]
    db.query(sql,sqlParams,function(err,result){
        if(err) throw err;
        if(result.affectedRows){
            res.send({status:"0",massage:"更改成功"});
        }
    })
}
exports.getUserByName =(req,res)=>{
    let sql ="SELECT username,id_card,phone,total_score,disabled FROM tb_user WHERE username LIKE ?"
    let str = '%'+req.body.username+'%'
    let sqlParams = [str];
    db.query(sql,sqlParams,function(err,result){
        if(err) throw err;
        res.send({status:"0",massage:"查询成功",data:result});
    })
}

// exports.all =(req,res)=>{
//     let sql = "UPDATE tb_user SET disabled = ? WHERE username =?"
//     let sqlParams =[]
//     db.query(sql,sqlParams,function(err,result){
//         if(err) throw err;
//         if(result.affectedRows){
//             res.send({status:"0",massage:"更改成功"});
//         }
//     })
// }