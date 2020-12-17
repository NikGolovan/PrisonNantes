var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var logger = require("../public/javascripts/core/logger/logger");
var common = require("../public/javascripts/core/commons/common");

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
    /* définition des variables nécessaires */
    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let duree = req.body.duree;
    let queryUpdateDuree = "UPDATE Condamnation SET duree = duree - " + duree + " WHERE n_ecrou = '" + n_ecrou + "' AND duree > " + duree;

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

    /* les données concernant réduction de peine */
    var form_data = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
        $duree: duree
    };

    /* les données concernant décision */
    var form_data_decision = {
        $n_type_decision: n_type_decision,
        $n_ecrou: n_ecrou,
        $date_decision: date_decision,
    };

    /* variables contenant les requêtes SQL */
    let queryInsert = "INSERT INTO Reduction_peine values ($n_type_decision, $n_ecrou, $date_decision, $duree)";
    let queryCheckId = "SELECT \"n_ecrou\" FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'";
    let queryInsertDecision = "INSERT OR IGNORE INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)";

    logger.infoCreateReductionPeine(req.body.n_ecrou);
    logger.infoExecQuery();
    /* execution des requêtes */
    dbConn.all(queryCheckId, function (err, result) {
        if (err) req.flash('error', err);
        /* insérer dans la table de Decision */
        dbConn.all(queryInsertDecision, form_data_decision, function (err, result) {
        })
        /* vérifier si Detenu existe */
        if (result.length > 0) {
            /* insérer dans la table Reduction_peine  */
            dbConn.all(queryInsert, form_data, function (err, result) {
                if (err) {
                    let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ?
                        "Veuillez saisir une autre date pour detenu " + n_ecrou + " car la réduction de peine pour cette date existe déjà." : err;
                    req.flash('error', erreurMsg);
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
                    dbConn.all(queryUpdateDuree, function (err) {if (err) req.flash('error', err); });
                    req.flash('success',
                        "Une nouvelle reduction de peine a été bien enregistré. Duration de condamnation du détenu '" + req.body.n_ecrou + "'  a été bien modifié.");
                    res.redirect(req.get('referer'));
                }
            });
        } else {
            req.flash('error', "Detenu avec le numero " + n_ecrou + " n'existe pas.");
            res.redirect('/reduire');
            return;
        }
    });
    /* afficher fin d'exécution des requêtes */
    logger.infoReductionPeineSuccess(req.body.n_ecrou);
});

/* Supprimer decision de réduction de peine */
router.get('/delete/(:n_ecrou)(:date_decision)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    let date_decision = req.params.date_decision;

    /* besoin de faire splice() car la chaîne est concaténée dans les req.params */
    var n_ecrou_escaped = n_ecrou.concat(date_decision.slice(0, -10));
    /* on va extraire la date aussi de req.params vu que le valeur dans les params est concaténé */
    var date_escaped = date_decision.substr(date_decision.indexOf("-") - 4);

    let queryUpdateDuree = "UPDATE Condamnation set duree = Condamnation.duree + " +
        "(SELECT Reduction_peine.duree from Reduction_peine where Reduction_peine.n_ecrou = '" + n_ecrou_escaped + "' AND " +
        "Reduction_peine.date_decision = '" + date_escaped + "') " +
        "WHERE Condamnation.n_ecrou = '" + n_ecrou_escaped + "'";

    /* mise à jour de la durée de manière automatique */
    dbConn.all(queryUpdateDuree, function (err, result) {
        if (err) req.flash('error', err);
    });

    logger.infoDelete(" liés à la libération de peine...");
    logger.infoExecQuery();
    dbConn.all("DELETE FROM Reduction_peine where n_ecrou = '" + n_ecrou_escaped + "' AND " +
        "date_decision = '" + date_escaped + "'", function (err) {
        if (err) {
            req.flash('error', err);
        } else {
            req.flash('success',
                "Réduction de peine a été bien supprimé. Duration de condamnation du détenu '" + req.params.n_ecrou + "'  a été bien modifié.");
            logger.infoDeleteSuccess();
            res.redirect('/reduire');
        }
    });
});

module.exports = router;