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

let query1 = `create table if not exists Detenu(
n_ecrou varchar(10),
prenom varchar(30),
nom varchar(30),
date_naissance Date,
lieu_naissance varchar(30),
constraint Detenu_key primary key(n_ecrou));`;

let query2 = `create table if not exists Affaire(
n_affaire varchar(10),
nom_juridiction varchar(30),
date_faits Date,
constraint Affaire_key primary key(n_affaire,nom_juridiction));`;

let query3 = `create table if not exists Detenu_Affaire(
n_ecrou varchar(10),
n_affaire varchar(10),
nom_juridiction varchar(30),
constraint Detenu_Affaire_key primary key(n_ecrou,n_affaire,nom_juridiction),
constraint Detenu_Affaire_foreign_key foreign key(n_ecrou) references Detenu(n_ecrou),
constraint Detenu_Affaire_foreign_key2 foreign key(n_affaire,nom_juridiction) references Affaire(n_affaire,nom_juridiction));`;

let query4 = `create table if not exists Motif(
n_motif varchar(10),
libelle_motif varchar(50) not null,
constraint Motif_key primary key(n_motif),
constraint Motif_unique unique(libelle_motif));`;

let query5 = `create table if not exists Incarceration(
n_ecrou varchar(10),
n_affaire varchar(10) not null,
nom_juridiction varchar(30) not null,
date_incarceration Date,
n_motif varchar(10) not null,
constraint Incarceration_key primary key(n_ecrou),
constraint Incarceration_foreign_key foreign key(n_ecrou,n_affaire,nom_juridiction) references Detenu_Affaire(n_ecrou,n_affaire,nom_juridiction),
constraint Incarceration_foreign_key2 foreign key(n_motif) references Motif(n_motif));`;

let query6 = `create table if not exists Decision(
n_type_decision varchar(1),
n_ecrou varchar(10),
date_decision Date,
constraint Decision_key primary key(n_type_decision,n_ecrou,date_decision),
constraint Decision_fk foreign key(n_ecrou) references Detenu(n_ecrou));`;

let query7 = `create table if not exists Condamnation(
n_type_decision varchar(1), 
n_ecrou varchar(10),
date_decision Date,
duree Integer,
constraint Condamnation_key primary key(n_type_decision,n_ecrou,date_decision),
constraint Condamnation_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`;

let query8 = `create table if not exists Reduction_peine(
n_type_decision varchar(1),
n_ecrou varchar(10),
date_decision Date,
duree Integer,
constraint Reduction_peine_key primary key(n_type_decision,n_ecrou,date_decision),
constraint Reduction_peine_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`;

let query9 = `create table if not exists Liberation_definitive(
n_type_decision varchar(1),
n_ecrou varchar(10),
date_decision Date,
date_liberation Date,
constraint Liberation_definitive_key primary key(n_type_decision,n_ecrou,date_decision),
constraint Liberation_definitive_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`;

var queries = [query1, query2, query3, query4, query5, query6, query7, query8, query9];

    db.all(query9, [], (err, rows) => {
        if (err) {
            throw err;
        }
        rows.forEach((row) => {
            console.log(row.name);
        });
    });


module.exports = db;