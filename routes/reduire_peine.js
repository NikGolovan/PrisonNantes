var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
const Logger = require("../public/javascripts/core/logger/logger");

/* Définition de logger */
let logger = new Logger();

/* initialiser la page de réduction de peine */
router.get('/', function (req, res, next) {
    dbConn.all('SELECT * FROM Reduction_peine ORDER BY n_ecrou desc', function (err, rows) {
        if (err) {
            req.flash('error', err);
            res.render('pages/reduire_peine', {data: ''});
        } else {
            res.render('pages/reduire_peine', {
                data: rows,
                n_type_decision: '',
                n_ecrou: '',
                date_decision: '',
                duree: ''
            });
        }
    });
});

/* Créer nouvelle réduction de peine */
router.post('/', function (req, res, next) {
    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let duree = req.body.duree;

    if (n_ecrou.length === 0 || n_type_decision.length === 0 ||
        date_decision.length === 0 || duree.length === 0) {
        req.flash('error', "Veuillez saisir tous les champs.");
        dbConn.all('SELECT * FROM Reduction_peine ORDER BY n_ecrou desc', function (err, rows) {
            if (err) {
                req.flash('error', err);
                res.render('pages/reduire_peine', {data: ''});
            } else {
                res.render('pages/reduire_peine', {
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

    let queryInsert = "INSERT INTO Reduction_peine values ($n_type_decision, $n_ecrou, $date_decision, $duree)";
    let queryCheckId = "SELECT \"n_ecrou\" FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'";
    let queryInsertDecision = "INSERT OR IGNORE INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)";

    logger.infoCreateReductionPeine(req.body.n_ecrou);
    logger.infoExecQuery();
    dbConn.all(queryCheckId, function (err, result) {
        if (err) throw err;
        dbConn.all(queryInsertDecision, form_data_decision, function (err, result) {
        })
        if (result.length > 0) {
            // insert query
            dbConn.all(queryInsert, form_data, function (err, result) {
                if (err) {
                    let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + n_ecrou + " déjà existe." : err;
                    req.flash('error', erreurMsg)
                    dbConn.all('SELECT * FROM Reduction_peine ORDER BY n_ecrou desc', function (err, rows) {
                        if (err) {
                            req.flash('error', err);
                            res.render('pages/reduire_peine', {data: ''});
                        } else {
                            res.render('pages/reduire_peine', {
                                data: rows,
                                n_type_decision: '',
                                n_ecrou: '',
                                date_decision: '',
                                duree: ''
                            });
                        }
                    });
                } else {
                    req.flash('success', 'Une nouvelle reduction de peine a été bien enregistré.');
                    res.redirect(req.get('referer'));
                }
            })
        } else {
            req.flash('error', "Detenu avec le numero " + n_ecrou + " n'existe pas.");
            res.redirect('/reduire');
            return;
        }
    })
    logger.infoReductionPeineSuccess(req.body.n_ecrou);
})

/* Afficher la page de modification des informations */
router.get('/edit/(:n_ecrou)(:date_decision)', function (req, res, next) {
    dbConn.all("SELECT * FROM Reduction_peine WHERE n_ecrou = '" + req.params.n_ecrou + "' AND " +
        "date_decision = '" + req.params.date_decision + "'", function (err, rows) {
        if (err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Pas de condamné avec n_ecrou = ' + n_ecrou)
            res.redirect('pages/reduire')
        } else {
            res.render('pages/edit_reduire_peine', rows[0])
        }
    })
})

/* Mettre à jour les information concernant réduction de peine */
router.post('/update/:n_ecrou:date_decision', function (req, res, next) {
    let fields = {
        n_ecrou: req.params.n_ecrou,
        date_decision: req.body.date_decision,
        duree: req.body.duree
    }

    if (req.body.canceled) {
        res.redirect('/reduire');
        return;
    }

    if (!allFieldsAreSet(fields)) {
        req.flash('error', "Veuillez saisir les modifications.");
        res.render('pages/edit_reduire_peine', {
            n_type_decision: req.params.n_type_decision,
            n_ecrou: req.params.n_ecrou,
            date_decision: req.body.date_decision,
            duree: req.body.duree
        })
    }

    var form_data = {
        $duree: req.body.duree
    }

    logger.infoUpdateQuery(" concernant réduction de peine pour condamné " + req.params.n_ecrou);
    logger.infoExecQuery();

    dbConn.run("UPDATE Reduction_peine SET duree = $duree WHERE n_ecrou = '" + fields["n_ecrou"] + "'" +
        " AND date_decision = '" + req.params.date_decision + "'", form_data, function (err, result) {
        if (err) {
            req.flash('error', err)
            res.render('pages/edit_reduire_peine', {
                date_decision: req.body.date_decision,
                n_ecrou: req.body.n_ecrou,
                duree: req.body.duree
            })
        } else {
            req.flash('success', 'Les informations ont été bien mises à jour.');
            res.redirect('/reduire');
        }
    })
    logger.infoUpdateSuccess();
})

/* Supprimer decision de réduction de peine */
router.get('/delete/(:n_ecrou)(:date_decision)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    let date_decision = req.params.date_decision;
    logger.infoDelete(" liés à la libération de peine...");
    logger.infoExecQuery();
    dbConn.all("DELETE FROM Reduction_peine where n_ecrou = '" + n_ecrou + "' AND " +
        "date_decision = '" + date_decision + "'", function (err) {
        if (err) {
            req.flash('error', err)
        } else {
            req.flash('success', 'Réduction de peine a été bien supprimé.');
            logger.infoDeleteSuccess();
            res.redirect('/reduire')
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