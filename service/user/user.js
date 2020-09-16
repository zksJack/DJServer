// var db = require('../../dao/mysqlDB');

//获取所有分类信息
exports.getAllInfo =(req,res)=>{
    //从数据库中拿数据扔到前端就ok  so easy
    var sql = 'SELECT * FROM ... '
    db.query(sql,function(err,result){
        if(err) throw err;
        res.send({status:"0",massage:"查询成功",data:result});
    });
}

exports.one = (req,res)=>{
    res.send("只是一个测试模块");
}
exports.two=(req,res)=>{
    res.send("这是一个测试路由=>get()");
}