var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* Initialiser la page de détenus en preventive */
router.get('/', function (req, res, next) {
    dbConn.all('SELECT Detenu.* FROM Detenu LEFT OUTER JOIN Decision ON Detenu.n_ecrou = Decision.n_ecrou WHERE (Decision.n_type_decision <> 1 OR Decision.n_type_decision is NULL) ORDER BY Detenu.n_ecrou desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('pages/preventive', {data: ''});
        } else {
            res.render('pages/preventive', {data: rows});
        }
    });
    req.flash('info', 'Modification des informations est possible à travers la page d\'accueil.');
});

module.exports = router;