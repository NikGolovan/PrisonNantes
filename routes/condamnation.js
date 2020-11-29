var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

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

// condamner
router.post('/', function (req, res, next) {
    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let duree = req.body.duree;
    let errors = false;

    if (n_ecrou.length === 0 || n_type_decision.length === 0 ||
        date_decision.length === 0 || duree.length === 0) {

        errors = true;
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
    }

    if (!errors) {

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

        dbConn.all(queryInsertDecision, form_data_decision, function (err, result) {
            if (err) throw err;
            console.log(result)
        })
        dbConn.all(queryCheckId, function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                // insert query
                dbConn.all(queryInsert, form_data, function (err, result) {
                    if (err) {
                        let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + n_ecrou + " déjà existe." : err;
                        req.flash('error', erreurMsg)

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
                req.flash('error', "Detenu avec le numero " + n_ecrou + " n'existe pas.");
                res.redirect('/condamnation');
                return;
            }
        })
    }
})

// display edit book page
router.get('/edit/(:n_ecrou)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    let query = "SELECT * FROM Condamnation WHERE n_ecrou = '" + n_ecrou + "'";

    dbConn.all(query, function (err, rows, fields) {
        if (err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Pas de condamné avec n_ecrou = ' + n_ecrou)
            res.redirect('/condamner')
        } else {
            res.render('pages/edit_condamnation', {
                title: 'Modifier Information',
                n_type_decision: rows[0].n_type_decision,
                n_ecrou: rows[0].n_ecrou,
                date_decision: rows[0].date_decision,
                duree: rows[0].duree,
                canceled: ''
            })
        }
    })
})

router.post('/condamnation/update/:n_ecrou', function (req, res, next) {
    let fields = {
        n_type_decision: req.params.n_type_decision,
        n_ecrou: req.params.n_ecrou,
        date_decision: req.body.date_decision,
        duree: req.body.duree
    }

    if (req.body.canceled) {
        res.redirect('pages/edit_condamnation');
        return;
    }

    if (!allFieldsAreSet(fields)) {
        errors = true;
        req.flash('error', "Veuillez saisir les modifications.");

        res.render('pages/condamnation', {
            n_type_decision: req.params.n_type_decision,
            n_ecrou: req.params.n_ecrou,
            date_decision: req.body.date_decision,
            duree: req.body.duree
        })
    }

    if (!errors) {

        var form_data = {
            $n_type_decision: req.params.n_type_decision,
            $n_ecrou: req.params.n_ecrou,
            $date_decision: req.body.date_decision,
            $duree: req.body.duree
        }

        dbConn.run("UPDATE Condamnation SET date_decision = $date_decision, $duree = $duree WHERE n_ecrou = '" + fields["n_ecrou"] + "'", form_data, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('pages/condamnation', {
                    n_ecrou: req.params.n_ecrou,
                    date_decision: req.body.date_decision,
                    duree: req.body.duree
                })
            } else {
                req.flash('success', 'Les informtions ont été bien mises à jour.');
                res.redirect('pages/condamnation');
            }
        })
    }
})

function allFieldsAreSet(fields) {
    for (let key in fields) {
        if (fields[key].length === 0)
            return false;
    }
    return true;
}


module.exports = router;