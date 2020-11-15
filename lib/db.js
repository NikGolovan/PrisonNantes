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

let query = `create table if not exists Detenu(
n_ecrou varchar(10),
prenom varchar(30),
nom varchar(30),
date_naissance Date,
lieu_naissance varchar(30),
constraint Detenu_key primary key(n_ecrou));`;

db.all(query, [], (err, rows) => {
    if (err) {
        throw err;
    }
    rows.forEach((row) => {
        console.log(row.name);
    });
});

module.exports = db;