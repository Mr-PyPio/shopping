// 引入mysql数据库
let mysql = require('mysql')

exports.base = (sql, data, callback) => {
  let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'my_object',
    port: '3306',
    multipleStatements: true
  })
  // 连接数据库
  connection.connect();
  connection.query(sql, data, (error, results) => {
    if (error) {
      console.log(error)
    }
    console.log(results)
    callback && callback(results, error)
  })
  //关闭数据库 
  connection.end();
}
