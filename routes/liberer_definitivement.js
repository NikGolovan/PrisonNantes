var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
const Logger = require("../public/javascripts/core/logger/logger");

/* Définition de logger */
let logger = new Logger();

/* initialiser la page de réduction de peine */
router.get('/', function (req, res, next) {
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
});

/* libérer définitivement */
router.post('/', function (req, res, next) {
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

    if (options["date_decision"] > options["date_liberation"]) {
        req.flash('error', "La date de libération ne peut pas être inférieure à la date de decision.");
        res.redirect(req.get('referer'));
        return;
    }

    if (!allFieldsAreSet(options)) {
        req.flash('error', "Veuillez saisir tous les champs.");
        dbConn.all('SELECT * FROM Liberation_definitive ORDER BY n_ecrou desc', function (err, rows) {
            if (err) {
                req.flash('error', err);
                res.render('pages/liberer_definitivement', {data: ''});
            } else {
                res.render('pages/liberer_definitivement', {
                    data: rows,
                    n_type_decision: n_type_decision,
                    n_ecrou: n_ecrou,
                    date_decision: date_decision,
                    date_liberation: date_liberation
                });
            }
        });
    }

    var form_data = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
        $date_liberation: date_liberation
    }

    var form_data_decision = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
    }

    let queryInsert = "INSERT INTO Liberation_definitive values ($n_type_decision, $n_ecrou, $date_decision, $date_liberation)";
    let queryCheckId = "SELECT n_ecrou FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'";
    let queryInsertDecision = "INSERT INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)";

    logger.infoCreateLiberation(n_ecrou);
    logger.infoExecQuery();
    dbConn.all(queryCheckId, function (err, result) {
        if (err) throw err;
        if (result.length > 0) {
            dbConn.all(queryInsertDecision, form_data_decision, function (err, result) {
                if (err) throw err;
            })
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
                    req.flash('success', 'Une nouvelle libération a été bien enregistré.');
                    res.redirect(req.get('referer'));
                }
            })
        } else {
            req.flash('error', "Détenu avec le numero " + n_ecrou + " n'existe pas.");
            res.redirect('/liberer');
            return;
        }
    })
    logger.infoLiberationSuccess();
})

function allFieldsAreSet(fields) {
    for (let key in fields) {
        if (fields[key].length === 0)
            return false;
    }
    return true;
}

module.exports = router;