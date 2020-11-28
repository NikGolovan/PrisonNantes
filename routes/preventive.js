var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    dbConn.all('SELECT * FROM Detenu INNER JOIN Decision ON Detenu.n_ecrou = Decision.n_ecrou ORDER BY n_ecrou desc', function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('pages/preventive',{data:''});
        } else {
            res.render('pages/preventive',{
                data: rows,
                n_ecrou: '',
                prenom: '',
                nom: ''
            });
        }
    });
});

router.post('/', function(req, res, next) {
    let n_ecrou = req.body.n_ecrou;
    let prenom = req.body.prenom;
    let nom = req.body.nom;
    let errors = false;

    if(n_ecrou.length === 0 || prenom.length === 0 || nom.length === 0 ) {

        errors = true;
        req.flash('error', "Veuillez saisir tous les champs.");

        dbConn.all('SELECT * FROM Detenu ORDER BY n_ecrou desc', function(err,rows) {
            if(err) {
                req.flash('error', err);
                res.render('pages/preventive',{data:''});
            } else {
                res.render('pages/preventive',{
                    data: rows,
                    n_ecrou: n_ecrou,
                    prenom: prenom,
                    nom: nom
                });
            }
        });
    }

    if(!errors) {

        var form_data = {
            $n_ecrou: n_ecrou,
            $prenom: prenom,
            $nom: nom
        }

        dbConn.all('INSERT INTO Decision values ($n_type_decision, $n_ecrou, $date_decision)', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "La decision avec le numéro " + n_ecrou + " déjà existe." : err;
                req.flash('error', erreurMsg)

                dbConn.all('SELECT * FROM Detenu ORDER BY n_ecrou desc', function(err,rows) {
                    if(err) {
                        req.flash('error', err);
                        res.render('pages/preventive',{data:''});
                    } else {
                        res.render('pages/preventive',{
                            data: rows,
                            n_ecrou: n_ecrou,
                            prenom: date_decision,
                            nom: n_type_decision
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