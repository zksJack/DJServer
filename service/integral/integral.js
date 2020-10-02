let db = require('../../dao/mysqlDB');
//获取所有的积分规则 
exports.getAllRule = (req, res) => {
    let sql = 'SELECT * FROM tb_integral_rule';
    db.query(sql, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        res.send({ status: "0", massage: "查询成功", data: result});
    })
}
//获取具体积分规则根据类型
exports.getRuleInfo = (req, res) => {
    let sql = 'SELECT * FROM tb_integral_rule WHERE type = ? ';
    let sqlParams = [req.body.type];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        console.log(result);
        res.send({ status: "0", massage: "查询成功", data: result[0] });
    })
}
//插入规则
exports.insertRule = (req, res) => {
    let sql = 'INSERT INTO tb_integral_rule (type,type_name,single_desc,max_num) VALUES(?,?,?,?)';
    let sqlParams = [
        req.body.type,
        req.body.type_name,
        req.body.single_desc, 
        req.body.max_num
    ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "插入成功" });
        } else {
            res.send({ status: "1", massage: "插入失败" });
        }
    })
}
//更新规则
exports.updateById = (req, res) => {
    let sql = 'UPDATE tb_integral_rule SET type = ?, type_name =?, single_desc =?, max_num = ? WHERE id =?';
    let sqlParams = [
        req.body.type,
        req.body.type_name,
        req.body.single_desc,
        req.body.max_num,
        req.body.ruleId,
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
//删除规则
exports.deleteById = (req, res) => {
    let sql = "DELETE FROM tb_integral_rule WHERE  id = ?"
    let sqlParams = [req.body.ruleId]
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows)
            res.send({ status: "0", massage: "删除成功" });
        else {
            res.send({ status: "1", massage: "删除失败" });
        }
    })
}
/*************用户积分信息*************** */
//添加信息关于积分
exports.insertUserInfo = (req, res) => {
    let sql = 'INSERT INTO tb_integral(user_id,type,type_name,cur_max,single_desc,max_num,create_time) VALUES(?,?,?,?,?,?,now())';
    let sqlParams = [
        req.body.user_id,
        req.body.type, 
        req.body.type_name,
        req.body.cur_max,
        req.body.single_desc,
        req.body.max_num,
    ];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result.affectedRows) {
            res.send({ status: "0", massage: "插入成功" });
        } else {
            res.send({ status: "1", massage: "插入失败" });
        }
    })
}
//查询用户所有积分
exports.pageQueryAllUser=(req,res)=>{
    let page = req.body.page || 1;
    (page <= 0) && (page = 1);
    let limit = req.body.limit * 1 || 10;
    let m = (page - 1) * limit;
    let sql = 'SELECT SQL_CALC_FOUND_ROWS * FROM tb_integral WHERE user_id =? ORDER BY create_time desc LIMIT ?,?';
    let sqlParams = [req.body.userId, m, limit];
    db.query(sql, sqlParams, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        var sql1 = "SELECT FOUND_ROWS() as count"
        db.query(sql1, function (err, total) {
            res.send({ status: "0", massage: "查询成功", total: total[0].count, data: result });
        })
    });
}
//更新用户总积分
exports.updateUserJifen = (req, res) => {
    let sql = `
    UPDATE tb_user 
	SET total_score= 
		(select a.total_score from (
		    SELECT SUM(i.single_desc) as total_score FROM tb_user
				LEFT JOIN tb_integral i ON tb_user.id = i.user_id
				WHERE tb_user.id = ?
	     ) as a
		)
	Where id = ?
    `;
    let sqlParams = [
        req.body.userId,req.body.userId,
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
//更新当前类型积分
exports.updateCurMax = (req, res) => {
    
    let sql1 = 'SELECT* FROM tb_integral WHERE user_id = ? and type = ?'
    let sqlParams1 = [req.body.user_id,req.body.type];
    db.query(sql1, sqlParams1, function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        if (result[0]) {
            if(result[0].cur_max < result[0].max_num){
                let sql = 'UPDATE tb_integral SET cur_max = ? WHERE user_id = ? and type = ?';
                let sqlParams = [
                    parseFloat(result[0].single_desc + result[0].cur_max)*1,
                    req.body.user_id,
                    req.body.type,
                ];
                db.query(sql, sqlParams, function (err, result1) {
                    if (err) return res.send({ status: "3306", massage: err.message });
                    if (result1.affectedRows) {
                        res.send({ status: "0", massage: "更改成功" });
                    } else {
                        res.send({ status: "1", massage: "更改失败" });
                    }
                })
            }
        } else {
            res.send({ status: "1", massage: "首次进行本积分，请先添加一条本类型的积分记录" });
        }
    })



    
}
