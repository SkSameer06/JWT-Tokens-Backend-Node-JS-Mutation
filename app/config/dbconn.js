const mysql = require('mysql');

// const connection = mysql.createConnection({ host: 'localhost', port: 3306,  database: 'myDb',  user: 'root', password: 'password' });


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'myDb'
  });

  //const _pool = new sql.ConnectionPool(sqlConfig);

  pool.getConnection(function (err) {
    if(err){
        console.log("error occurred while connecting");
    }
    else{
        console.log("connection created with Mysql successfully");
    }
  });

  module.exports = { pool: pool };