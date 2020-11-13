/*var mysql = require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'adminmysql',
    password:'',
    database:'belote',
    insecureAuth : true
});
connection.connect(function(error){
    if(!!error) {
        console.log(error);
    } else {
        console.log('Connected..!');
    }
}); */

const sqlite3 = require('sqlite3');
// open the database
let db = new sqlite3.Database('./db/data.db');

let query = `CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name varchar(100) DEFAULT NULL,
  author varchar(50) DEFAULT NULL
);`;

db.all(query, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});

module.exports = db;