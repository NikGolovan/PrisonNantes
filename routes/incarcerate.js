var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

router.get('/', function(req, res, next) {
    dbConn.all('SELECT * FROM Incarceration ORDER BY n_ecrou desc', function(err,rows) {
        if(err) {
            req.flash('error', err);
            res.render('pages/incarcerate',{data:''});
        } else {
            res.render('pages/incarcerate',{
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

// incarcérer
router.post('/', function(req, res, next) {
    let n_ecrou = req.body.n_ecrou;
    let n_affaire = req.body.n_affaire;
    let nom_juridiction = req.body.nom_juridiction;
    let date_incarceration = req.body.date_incarceration;
    let n_motif = req.body.n_motif;
    let errors = false;

    console.log(n_ecrou)
    console.log(n_affaire)
    console.log(nom_juridiction)
    console.log(date_incarceration)
    console.log(n_motif)

    if(n_ecrou.length === 0 || n_affaire.length === 0 ||
        nom_juridiction.length === 0 || date_incarceration.length === 0 || n_motif.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Veuillez saisir tous les champs.");
        // render to add.ejs with flash message
        dbConn.all('SELECT * FROM Incarceration ORDER BY n_ecrou desc', function(err,rows) {
            if(err) {
                req.flash('error', err);
                res.render('pages/incarcerate',{data:''});
            } else {
                res.render('pages/incarcerate',{
                    data: rows,
                    n_ecrou: '',
                    n_affaire: '',
                    nom_juridiction: '',
                    date_incarceration: '',
                    n_motif: ''
                });
            }
        });
    }

    // if no error
    if(!errors) {

        var form_data = {
            $n_ecrou: n_ecrou,
            $n_affaire: n_affaire,
            $nom_juridiction: nom_juridiction,
            $date_incarceration: date_incarceration,
            $n_motif: n_motif
        }

        // insert query
        dbConn.all('INSERT INTO Incarceration values ($n_ecrou, $n_affaire, $nom_juridiction, $date_incarceration, $n_motif)', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + n_ecrou + " déjà existe." : err;
                req.flash('error', erreurMsg)
                // render to add.ejs
                dbConn.all('SELECT * FROM Incarceration ORDER BY n_ecrou desc', function(err,rows) {
                    if(err) {
                        req.flash('error', err);
                        res.render('pages/incarcerate',{data:''});
                    } else {
                        res.render('pages/incarcerate',{
                            data: rows,
                            n_ecrou: '',
                            n_affaire: '',
                            nom_juridiction: '',
                            date_incarceration: '',
                            n_motif: ''
                        });
                    }
                });
            } else {
                req.flash('success', 'Nouveau incarcéré a été bien enregistré.');
                res.redirect(req.get('referer'));
            }
        })
    }
})

module.exports = router;