var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
const Logger = require("../public/javascripts/core/logger");

/* Definition de logger */
let logger = new Logger();

/* Initialiser la page de condamnation */
router.get('/', function (req, res, next) {
    dbConn.all('SELECT * FROM Condamnation ORDER BY n_ecrou desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('pages/condamner', {data: ''});
        } else {
            res.render('pages/condamner', {
                data: rows,
                n_type_decision: '',
                n_ecrou: '',
                date_decision: '',
                duree: ''
            });
        }
    });
});

/* Condamner */
router.post('/', function (req, res, next) {
    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let duree = req.body.duree;

    let options = {
        n_type_decision: req.body.n_type_decision,
        n_ecrou: req.body.n_ecrou,
        date_decision: req.body.date_decision,
        duree: req.body.duree
    }

    if (!allFieldsAreSet(options)) {
        req.flash('error', "Veuillez saisir tous les champs.");
        dbConn.all('SELECT * FROM Condamnation ORDER BY n_ecrou desc', function (err, rows) {
            if (err) {
                req.flash('error', err);
                res.render('pages/condamner', {data: ''});
            } else {
                res.render('pages/condamner', {
                    data: rows,
                    n_type_decision: n_type_decision,
                    n_ecrou: n_ecrou,
                    date_decision: date_decision,
                    duree: duree
                });
            }
        });
        return;
    }

    var form_data = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
        $duree: duree
    }

    var form_data_decision = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
    }

    let queryInsert = "INSERT INTO Condamnation values ($n_type_decision, $n_ecrou, $date_decision, $duree)";
    let queryInsertDecision = "INSERT INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)";
    let queryCheckId = "SELECT \"n_ecrou\" FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'";

    dbConn.all(queryCheckId, function (err, result) {
        if (err) throw err;
        dbConn.all(queryInsertDecision, form_data_decision, function (err, result) {
            if (err) {
                let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + n_ecrou + " a été déjà condamné." : err;
                req.flash('error', erreurMsg)
            }
        })
        if (result.length > 0) {
            dbConn.all(queryInsert, form_data, function (err, result) {
                if (err) {
                    dbConn.all('SELECT * FROM Condamnation ORDER BY n_ecrou desc', function (err, rows) {
                        if (err) {
                            req.flash('error', err);
                            res.render('pages/condamner', {data: ''});
                        } else {
                            res.render('pages/condamner', {
                                data: rows,
                                n_type_decision: '',
                                n_ecrou: '',
                                date_decision: '',
                                duree: ''
                            });
                        }
                    });
                } else {
                    req.flash('success', 'Une nouvelle condamnation a été bien enregistré.');
                    res.redirect(req.get('referer'));
                }
            })
        } else {
            req.flash('error', "Détenu avec le numéro " + n_ecrou + " n'existe pas.");
            res.redirect('/condamnation');
        }
    })
})

/* Afficher la page de modification des informations d'un détenu condamné  */
router.get('/edit/(:n_ecrou)', function (req, res, next) {
    dbConn.all("SELECT * FROM Condamnation WHERE n_ecrou = '" + req.params.n_ecrou + "'", function (err, rows, fields) {
        if (err) throw err;
        if (rows.length <= 0) {
            req.flash('error', 'Pas de condamné avec n_ecrou = ' + n_ecrou)
            res.redirect('pages/condamner')
        } else {
            res.render('pages/edit_condamnation', rows[0])
        }
    })
})

/* Modifier les information concernant un détenu condamné */
router.post('/update/:n_ecrou', function (req, res, next) {
    let fields = {
        n_ecrou: req.params.n_ecrou,
        date_decision: req.body.date_decision,
        duree: req.body.duree
    }

    if (req.body.canceled) {
        res.redirect('/condamnation');
        return;
    }

    if (!allFieldsAreSet(fields)) {
        req.flash('error', "Veuillez saisir les modifications.");
        res.render('pages/edit_condamnation', {n_type_decision: req.params.n_type_decision, fields})
    }

    var form_data = {
        $date_decision: req.body.date_decision,
        $duree: req.body.duree
    }

    logger.infoUpdateQuery(" du condamné " + req.params.n_ecrou);
    logger.infoExecQuery();
    dbConn.run("UPDATE Condamnation SET date_decision = $date_decision, duree = $duree WHERE n_ecrou = '" + fields["n_ecrou"] + "'", form_data, function (err, result) {
        if (err) {
            req.flash('error', err)
            res.render('pages/edit_condamnation', {
                date_decision: req.body.date_decision,
                duree: req.body.duree
            })
        } else {
            req.flash('success', 'Les informations ont été bien mises à jour.');
            logger.infoUpdateSuccess();
            res.redirect('/condamnation');
        }
    })
})

/* Supprimer decision de condamnation */
router.get('/delete/(:n_ecrou)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    logger.infoDelete(" liés au condamné " + n_ecrou + " ...");
    logger.infoExecQuery();
    dbConn.all("DELETE FROM Decision where n_ecrou = '" + n_ecrou + "'", function (err) {
        if (err) {
            req.flash('error', err)
        } else {
            req.flash('success', 'Enregistrement avec numéro d\'écrou ' + n_ecrou + ' a été bien supprimé.');
            logger.infoDeleteSuccess();
            res.redirect('/condamnation')
        }
    })
})

function allFieldsAreSet(fields) {
    for (let key in fields) {
        if (fields[key].length === 0)
            return false;
    }
    return true;
}


module.exports = router;