var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    dbConn.all('SELECT * FROM Decision ORDER BY n_ecrou desc', function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('pages/decision',{data:''});
        } else {
            res.render('pages/decision',{
                data: rows,
                n_type_decision: '',
                n_ecrou: '',
                date_decision: ''
            });
        }
    });
});

// prendre decision
router.post('/', function(req, res, next) {
    let n_type_decision = req.body.n_type_decision;
    let n_ecrou = req.body.n_ecrou;
    let date_decision = req.body.date_decision;
    let errors = false;

    if(n_type_decision.length === 0 || n_ecrou.length === 0 || date_decision.length === 0 ) {

        errors = true;

        // set flash message
        req.flash('error', "Veuillez saisir tous les champs.");
        // render to add.ejs with flash message
        dbConn.all('SELECT * FROM Decision ORDER BY n_ecrou desc', function(err,rows) {
            if(err) {
                req.flash('error', err);
                res.render('pages/incarcerate',{data:''});
            } else {
                res.render('pages/incarcerate',{
                    data: rows,
                    n_type_decision: n_type_decision,
                    n_ecrou: n_ecrou,
                    date_decision: date_decision
                });
            }
        });
    }

    // if no error
    if(!errors) {

        var form_data = {
            $n_type_decision: n_type_decision,
            $n_ecrou: n_ecrou,
            $date_decision: date_decision
        }

        // insert query
        dbConn.all('INSERT INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "La decision avec le numéro " + n_ecrou + " déjà existe." : err;
                req.flash('error', erreurMsg)
                // render to add.ejs
                dbConn.all('SELECT * FROM Decision ORDER BY n_ecrou desc', function(err,rows) {
                    if(err) {
                        req.flash('error', err);
                        res.render('pages/decision',{data:''});
                    } else {
                        res.render('pages/decision',{
                            data: rows,
                            n_type_decision: n_type_decision,
                            n_ecrou: n_ecrou,
                            date_decision: date_decision
                        });
                    }
                });
            } else {
                req.flash('success', 'La decision a été bien enregistré.');
                res.redirect(req.get('referer'));
            }
        })
    }
})

module.exports = router;