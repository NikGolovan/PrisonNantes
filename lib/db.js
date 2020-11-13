var mysql = require('mysql');
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
});

module.exports = connection;