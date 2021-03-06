let db = require('../../dao/mysqlDB');
let path = require("path");
let utils = require('../../utils/utile')
let fs = require('fs')
/**得到所有新闻类型 */
exports.getAllNewsTypes = (req, res) => {
    let sql = "SELECT * FROM tb_news_type"
    let sqlParams = []
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        res.send({ status: "0", massage: "查询成功", data: result });
    })
}
//得到所有新闻 <分页>
exports.getAllNews = (req, res) => {
    let page = req.body.page * 1 || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = '';
    let sqlParams = [];
    if (req.body.type == undefined || req.body.type == null || req.body.type == '') {
        sql = "SELECT SQL_CALC_FOUND_ROWS n.*,typeName FROM tb_news_type t LEFT JOIN tb_news n ON n.type = t.newsType_id WHERE n.news_id is not null LIMIT ?,?"
        sqlParams = [m, limit];
    } else {
        sql = "SELECT SQL_CALC_FOUND_ROWS n.*,typeName FROM tb_news_type t LEFT JOIN tb_news n ON n.type = t.newsType_id WHERE n.type=? AND  n.news_id is not null LIMIT ?,?";
        sqlParams = [req.body.type, m, limit];
    }
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            if (err) return res.send({ status: "3306", massage: err.message });
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    })
}
//根据newsID拿到新闻信息
exports.getNewsById = (req, res) => {
    //缓存图片路径
    let sql = "SELECT n.*,typeName FROM tb_news n,tb_news_type t WHERE n.type = t.newsType_id and news_id = ?"
    let sqlParams = [req.body.newID]
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//根据newsID删除新闻信息
/**新闻删除 轮播图要删除 轮播图删除 新闻不删除  未去实现 待定*/
exports.deleteNewsById = (req, res) => {
    // let sqla = 'SELECT pic FROM tb_news WHERE news_id = ?';
    // let sqlParamsa = [req.body.newID];
    // db.query(sqla, sqlParamsa, function (err, resulta) {
    //     if (err) throw err;
    //     if (resulta) {
            let sql = "DELETE FROM tb_news WHERE news_id = ?" //删除新闻   
            let sqlParams = [req.body.newID]
            db.query(sql, sqlParams, function (err, result) {
                if (err) return res.send({ status: "3306", massage: err.message });
                console.log(result);
                if (result.affectedRows) {
                    // try {
                    //     fs.unlinkSync(path.join(__dirname, '../..' + resulta[0].pic));
                    // } catch (error) {
                    //     console.log("图片没有");
                    // }
                    res.send({ status: "0", massage: "删除成功" });
                }
                else {
                    res.send({ status: "1", massage: "删除失败" });
                }
            })
    //     }
    // })

}
//根据newsID更新新闻信息
exports.updateNewsById = (req, res) => {
    // let sqla = 'SELECT pic FROM tb_news WHERE news_id = ?';
    // let sqlParamsa = [req.body.newID];
    // db.query(sqla, sqlParamsa, function (err, resulta) {   //缓存图片路径
    //     if (err) throw err;
        let sql = '';
        let sqlParams = [];
        let flg = false; //若是ture 表示是更换图片
        if (req.file) {
            sql = "UPDATE tb_news SET title=?,author=?,titleDesc=?,content=?, pic=?,update_time= now(),type=?,count=?,comment=? WHERE news_id=?"
            sqlParams = [ req.body.title,req.body.author,req.body.titleDesc,req.body.content,path.join("/uploads", req.file.filename),req.body.type,0, 0,req.body.newID];
            flg = true;
        } else {
            sql = "UPDATE tb_news SET title=?,author=?,titleDesc=?,content=?,update_time= now(),type=?,count=?,comment=? WHERE news_id=?"
            sqlParams = [req.body.title,req.body.author,req.body.titleDesc,req.body.content,req.body.type,0,0,req.body.newID];
        }
        db.query(sql, sqlParams, function (err, result) {
            if (err) return res.send({ status: "3306", massage: err.message });
            if (result.affectedRows){
                //更新完成后删除问件
                // try {
                //    flg && fs.unlinkSync(path.join(__dirname, '../..' + resulta[0].pic));
                // } catch (error) {
                //     console.log("图片没有");
                // }
                res.send({ status: "0", massage: "更新成功" });
                }
            else {
                res.send({ status: "1", massage: "更新失败" });
            }
        })
    // })
}
//插入新闻信息
exports.insertNews = (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    if (!req.file || req.file.fieldname !== 'pic') {
        return res.send({ status: '1', massage: "图片不能为空" });
    }
    let sql = "INSERT INTO tb_news(title,author,titleDesc,content, pic,create_time,type,count,comment) VALUES(?,?,?,?,?,now(),?,?,?)"
    let sqlParams = [
        req.body.title,
        req.body.author,
        req.body.titleDesc,
        req.body.content,
        path.join("/uploads", req.file.filename),
        //  utils.dateFtt("yyyy-MM-dd hh:mm:ss",new Date()),
        req.body.type,
        0,
        0];
    console.log(sqlParams);
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows || result[0].affectedRows)
            res.send({ status: "0", massage: "插入成功" });
        else {
            res.send({ status: "1", massage: "插入失败" });
        }
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