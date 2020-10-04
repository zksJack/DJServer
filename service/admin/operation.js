/*******管理员操作 */
let db = require('../../dao/mysqlDB');
let path = require('path');
let fs = require('fs')

//获取所有图片路径
exports.selectAllURL = (req, res) => {
    let sql = `
    select distinct img_url FROM tb_carousel;
    select distinct pic_url FROM tb_picture;
    select distinct header FROM tb_user;
    select distinct pic FROM tb_news;
    `;
    db.query(sql,function (err, result) {
        if (err) return res.send({ status: "3306", massage: err.message });
        let urlArr =[];                 //数据库所有图片路径的数组
        result.forEach(element => {     // 提取数据库所有图片路径
            element != null &&
            element.forEach(item=>{
                if(item != null){
                    let arr = Object.values(item)[0].split(/(\/)|\\/);  //分割图片路径
                    urlArr.push(arr[arr.length-1]);  //只获取文件名
                }
            });
        });
        var resultArr=[];  //储蓄删除的文件名
        var readDir = fs.readdirSync(path.join(__dirname, '../../uploads'));  //读取图片文件夹下所有的图片名称
        readDir.forEach(item=>{
            if(urlArr.indexOf(item) == -1){                                   //如果问件在数据库没有引用 删除
                resultArr.push("删除文件 ： "+item);
                fs.unlinkSync(path.join(__dirname, '../../uploads/' + item)); //删除文件
            }
        })
        res.send({ status: "0", massage: "清理成功", data: resultArr});
     })
}
