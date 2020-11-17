const sqlite3 = require('sqlite3');
let db = new sqlite3.Database('./db/data.db');
const constants = require('./db_init.js');

function createTables() {
    db.all(constants.CREATE_TABLE_DETENU, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_AFFAIRE, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_DETENU_AFFAIRE, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_MOTIF, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_INCARCERATION, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_DECISION, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_CONDAMNATION, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_REDUCION_PEINE, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
    db.all(constants.CREATE_TABLE_LIBERATION_DEFINITIVE, [], (err, rows) => { if (err) { throw err; } rows.forEach((row) => {console.log(row.name); }); });
}

createTables();
module.exports = db;