var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    dbConn.all('SELECT * FROM Liberation_definitive ORDER BY n_ecrou desc', function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('pages/liberer_definitivement',{data:''});
        } else {
            res.render('pages/liberer_definitivement',{
                data: rows,
                n_type_decision: '',
                n_ecrou: '',
                date_decision: '',
                date_liberation: ''
            });
        }
    });
});

router.post('/', function(req, res, next) {
    const options = {
        n_type_decision: req.body.n_type_decision,
        n_ecrou: req.body.n_ecrou,
        date_decision: req.body.date_decision,
        date_liberation: req.body.date_liberation
    }

    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let date_liberation = req.body.date_liberation;
    let errors = false;

    if (options["date_decision"] > options["date_liberation"]) {
        req.flash('error', "La date de liberation ne peut pas être inférieure à la date de decision.");
        res.redirect(req.get('referer'));
        return;
    }

    if(n_ecrou.length === 0 || n_type_decision.length === 0 ||
        date_decision.length === 0 || date_liberation.length === 0) {

        errors = true;
        req.flash('error', "Veuillez saisir tous les champs.");

        dbConn.all('SELECT * FROM Liberation_definitive ORDER BY n_ecrou desc', function(err,rows) {
            if(err) {
                req.flash('error', err);
                res.render('pages/liberer_definitivement',{data:''});
            } else {
                res.render('pages/liberer_definitivement',{
                    data: rows,
                    n_type_decision: n_type_decision,
                    n_ecrou: n_ecrou,
                    date_decision: date_decision,
                    date_liberation: date_liberation
                });
            }
        });
    }

    if(!errors) {

        var form_data = {
            $n_type_decision: n_type_decision,
            $n_ecrou: n_ecrou,
            $date_decision: date_decision,
            $date_liberation: date_liberation
        }

        let queryInsert = "INSERT INTO Liberation_definitive values ($n_type_decision, $n_ecrou, $date_decision, $date_liberation)";
        let queryCheckId = "SELECT \"n_ecrou\" FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'";

        dbConn.all(queryCheckId, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                // insert query
                dbConn.all(queryInsert, form_data, function (err, result) {
                    if (err) {
                        let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + n_ecrou + " déjà existe." : err;
                        req.flash('error', erreurMsg)

                        dbConn.all('SELECT * FROM Liberation_definitive ORDER BY n_ecrou desc', function (err, rows) {
                            if (err) {
                                req.flash('error', err);
                                res.render('pages/liberer_definitivement', {data: ''});
                            } else {
                                res.render('pages/liberer_definitivement', {
                                    data: rows,
                                    n_type_decision: '',
                                    n_ecrou: '',
                                    date_decision: '',
                                    date_liberation: ''
                                });
                            }
                        });
                    } else {
                        req.flash('success', 'Une nouvelle liberation a été bien enregistré.');
                        res.redirect(req.get('referer'));
                    }
                })
            } else {
                req.flash('error', "Detenu avec le numero " + n_ecrou + " n'existe pas.");
                res.redirect('/liberer');
                return;
            }
        })
    }
})
module.exports = router;