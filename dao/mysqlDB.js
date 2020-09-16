var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : '118.178.85.48',
  user     : 'root',
  password : '123456',
  database : 'DJServer'
});
 
module.exports  = connection;