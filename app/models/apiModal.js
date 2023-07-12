const mysql = require('mysql');


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

module.exports = class Users {
    static signup(name, number, email, password) {
        console.log(name,number,email,password);
        const statement = `INSERT INTO users (name, number, email, password) VALUES (?, ?, ?, ?)`;
        const values = [name, number, email, password];
        return new Promise((resolve, reject) => {
            pool.query(statement, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    static loginUser(email, password) {
        //console.log(email,password);
        const statement = `select * from users where email = ? and password = ?`;
        const values = [email, password];
        return new Promise((resolve, reject) => {
            pool.query(statement, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                   // console.log(results);
                    resolve(results);
                }
            });
        });
    }

    static userById(id) {
        console.log(id);
        const statement = `select * from users where id = ?`;
        const values = [id];
        return new Promise((resolve, reject) => {
            pool.query(statement, values, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(results);
                    resolve(results);
                }
            });
        });
    }
}