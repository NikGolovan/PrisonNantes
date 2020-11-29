var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var Detenu = require('../public/javascripts/core/detenu');

router.get('/', function (req, res, next) {

    dbConn.all('SELECT * FROM Detenu INNER JOIN Incarceration ON Detenu.n_ecrou = Incarceration.n_ecrou ORDER BY n_ecrou desc', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('pages', {data: ''});
        } else {
            res.render('pages', {data: rows});
        }
    });
});

router.get('/add', function (req, res, next) {
    res.render('pages/add', {
        n_ecrou: '',
        prenom: '',
        nom: '',
        date_naissance: '',
        lieu_naissance: '',
        date_incarceration: '',
        nom_juridiction: '',
        n_affaire: '',
        n_motif: '',
        canceled: ''
    })
})

// add a new book
router.post('/add', function (req, res, next) {
    const options = {
        n_ecrou: req.body.n_ecrou,
        prenom: req.body.prenom,
        nom: req.body.nom,
        date_naissance: req.body.date_naissance,
        lieu_naissance: req.body.lieu_naissance,
        date_incarceration: req.body.date_incarceration,
        nom_juridiction: req.body.nom_juridiction,
        n_affaire: req.body.n_affaire,
        n_motif: req.body.n_motif
    }

    const detenu = new Detenu({
        n_ecrou: req.body.n_ecrou,
        prenom: req.body.prenom,
        nom: req.body.nom,
        date_naissance: req.body.date_naissance,
        lieu_naissance: req.body.lieu_naissance,
    });

    if (req.body.canceled) {
        res.redirect('/');
        return;
    }

    if (!allFieldsAreSet(options)) {
        req.flash('error', "Veuillez saisir tous les champs.");
        res.render('pages/add', options);
        return;
    }

    if (options["date_incarceration"] < options["date_naissance"]) {
        req.flash('error', "La date d'incarceration ne peut pas être inférieure à la date de naissance.");
        res.render('pages/add', options);
        return;
    }

    var form_data = {
        $n_ecrou: detenu["n_ecrou"],
        $prenom: detenu["prenom"],
        $nom: detenu["nom"],
        $date_naissance: detenu["date_naissance"],
        $lieu_naissance: detenu["lieu_naissance"],
    }

    var form_data1 = {
        $n_ecrou: req.body.n_ecrou,
        $date_incarceration: req.body.date_incarceration,
        $nom_juridiction: req.body.nom_juridiction,
        $n_affaire: req.body.n_affaire,
        $n_motif: req.body.n_motif
    }

    // insert query
    dbConn.all('INSERT INTO Detenu values ($n_ecrou, $prenom, $nom, $date_naissance, $lieu_naissance)', form_data, function (err, result) {
        if (err) throw err
    })
    dbConn.all('INSERT INTO Incarceration values ($n_ecrou, $n_affaire, $nom_juridiction, $date_incarceration, $n_motif)', form_data1, function (err, result) {
        if (err) throw err
    })
    res.redirect('/');
})

// display edit book page
router.get('/edit/(:n_ecrou)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;

    dbConn.all("SELECT * FROM Detenu deten1, Incarceration incr1 WHERE 'deten1." + n_ecrou + "' = incr1.n_ecrou UNION SELECT * FROM Detenu deten2, Incarceration incr2 WHERE deten2.n_ecrou = incr2.n_ecrou", function (err, rows, fields) {
        if (err) throw err
        if (rows.length <= 0) {
            req.flash('error', 'Pas de détenu avec n_ecrou = ' + n_ecrou)
            res.redirect('/')
        } else {
            // render to edit.ejs
            res.render('pages/edit', {
                title: 'Modifier Information',
                n_ecrou: rows[0].n_ecrou,
                prenom: rows[0].prenom,
                nom: rows[0].nom,
                date_naissance: rows[0].date_naissance,
                lieu_naissance: rows[0].lieu_naissance,
                date_incarceration: rows[0].date_incarceration,
                nom_juridiction: rows[0].nom_juridiction,
                n_affaire: rows[0].n_affaire,
                n_motif: rows[0].n_motif,
                canceled: ''
            })
        }
    })

    dbConn.all("SELECT * FROM Incarceration WHERE n_ecrou = '" + n_ecrou + "'", function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Pas de détenu avec n_ecrou = ' + n_ecrou)
            res.redirect('/')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('pages/edit', {
                title: 'Modifier Information',
                n_ecrou: rows[0].n_ecrou,
                n_affaire: rows[0].n_affaire,
                nom_juridiction: rows[0].nom_juridiction,
                date_incarceration: rows[0].date_incarceration,
                n_motif: rows[0].n_motif,
                canceled: ''
            })
        }
    })
})

router.post('/update/:n_ecrou', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    let prenom = req.body.prenom;
    let nom = req.body.nom;
    let date_naissance = req.body.date_naissance;
    let lieu_naissance = req.body.lieu_naissance;
    let n_affaire = req.body.n_affaire;
    let nom_juridiction = req.body.nom_juridiction;
    let date_incarceration = req.body.date_incarceration;
    let n_motif = req.body.n_motif;
    let canceled = req.body.canceled;
    let errors = false;

    if (canceled) {
        res.redirect('/');
        return;
    }

    if (n_ecrou.length === 0 || prenom.length === 0 ||
        nom.length === 0 || date_naissance.length === 0 || lieu_naissance.length === 0 || n_affaire.length === 0
        || nom_juridiction.length === 0 || date_incarceration.length === 0 || n_motif.length === 0) {
        errors = true;
        req.flash('error', "Veuillez saisir les modifications.");

        res.render('pages/edit', {
            n_ecrou: req.params.n_ecrou,
            nom: nom,
            prenom: prenom,
            date_naissance: date_naissance,
            lieu_naissance: lieu_naissance,
            date_incarceration: date_incarceration,
            nom_juridiction: nom_juridiction,
            n_affaire: n_affaire,
            n_motif: n_motif
        })
    }

    if (!errors) {

        var form_data = {
            $prenom: prenom,
            $nom: nom,
            $date_naissance: date_naissance,
            $lieu_naissance: lieu_naissance,
        }

        var form_data1 = {
            $date_incarceration: date_incarceration,
            $nom_juridiction: nom_juridiction,
            $n_affaire: n_affaire,
            $n_motif: n_motif
        }

        dbConn.run("UPDATE Detenu SET prenom = $prenom, nom = $nom, date_naissance = $date_naissance, lieu_naissance = $lieu_naissance WHERE n_ecrou = '" + n_ecrou + "'", form_data, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('pages/edit', {
                    n_ecrou: req.params.n_ecrou,
                    nom: nom,
                    prenom: prenom,
                    date_naissance: date_naissance,
                    lieu_naissance: lieu_naissance,
                    date_incarceration: date_incarceration,
                    nom_juridiction: nom_juridiction,
                    n_affaire: n_affaire,
                    n_motif: n_motif
                })
            } else {
                //req.flash('success', 'Les informtions ont été bien mises à jour.');
                //res.redirect('/');
            }
        })
        dbConn.run("UPDATE Incarceration SET n_affaire = $n_affaire, nom_juridiction = $nom_juridiction, date_incarceration = $date_incarceration, n_motif = $n_motif WHERE n_ecrou = '" + n_ecrou + "'", form_data1, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.render('pages/edit', {
                    n_ecrou: req.params.n_ecrou,
                    n_affaire: n_affaire,
                    nom_juridiction: nom_juridiction,
                    date_incarceration: date_incarceration,
                    n_motif: n_motif
                })
            } else {
                req.flash('success', 'Les informtions ont été bien mises à jour.');
                res.redirect('/');
            }
        })
    }
})

router.get('/delete/(:n_ecrou)', function (req, res, next) {

    let n_ecrou = req.params.n_ecrou;

    dbConn.all("DELETE FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'", function (err, result) {
        if (err) {
            req.flash('error', err)
        }
    })
    dbConn.all("DELETE FROM Incarceration WHERE n_ecrou = '" + n_ecrou + "'", function (err, result) {
        if (err) {
            req.flash('error', err)
        } else {
            req.flash('success', 'Enregistrement avec numéro d\'écrou ' + n_ecrou + ' a été bien supprimé.');
            res.redirect('/')
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