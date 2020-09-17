var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '118.178.85.48',
  user     : 'root',
  password : '123456',
  database : 'DJServer',
  //开启sql多条执行命令
  multipleStatements: true
});
 
module.exports  = connection;