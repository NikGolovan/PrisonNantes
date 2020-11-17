var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    dbConn.all('SELECT * FROM Incarceration ORDER BY n_ecrou desc', function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('pages/decision',{data:''});
        } else {
            res.render('pages/decision',{
                data: rows,
                n_ecrou: '',
                n_affaire: '',
                nom_juridiction: '',
                date_incarceration: '',
                n_motif: ''
            });
        }
    });
});

module.exports = router;