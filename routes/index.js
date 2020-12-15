var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var Detenu = require('../public/javascripts/core/detenu');
var Affaire = require('../public/javascripts/core/affaire');
var Motif = require('../public/javascripts/core/motif');
const Logger = require("../public/javascripts/core/logger");

/* definition de logger */
let logger = new Logger();

/* initializer la page d'accueil */
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

/* initializer la page d'incarcération */
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
        libelle_motif: '',
        canceled: ''
    })
})

/* Incarcérer le détenu */
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
        n_motif: req.body.n_motif,
        libelle_motif: req.body.libelle_motif,
    }

    /* l'instance du detenu */
    let detenu = new Detenu({
        n_ecrou: req.body.n_ecrou,
        prenom: req.body.prenom,
        nom: req.body.nom,
        date_naissance: req.body.date_naissance,
        lieu_naissance: req.body.lieu_naissance,
    });

    /* l'instance du motif */
    let motif = new Motif({
        n_motif: req.body.n_motif,
        libelle_motif: req.body.nom_juridiction
    });

    /* l'instance de l'affaire */
    let affaire = new Affaire({
        n_affaire: req.body.n_affaire,
        nom_juridiction: req.body.nom_juridiction,
        date_incarceration: req.body.date_incarceration
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

    if (options["date_incarceration"] <= options["date_naissance"]) {
        req.flash('error', "La date d'incarceration ne peut pas être inférieure ou égale à la date de naissance.");
        res.render('pages/add', options);
        return;
    }

    /* création du tableau des commandes pour exécution batch du SQL */
    let arr = [
        "INSERT INTO Detenu values ($n_ecrou, $prenom, $nom, $date_naissance, $lieu_naissance)",
        "INSERT OR IGNORE INTO Affaire values ($n_affaire, $nom_juridiction, $date_incarceration)",
        "INSERT OR IGNORE INTO Motif values ($n_motif, $libelle_motif)",

        "INSERT INTO Detenu_Affaire (n_ecrou, n_affaire, nom_juridiction) " +
        "SELECT Detenu.n_ecrou, Affaire.n_affaire, Affaire.nom_juridiction " +
        "FROM Detenu, Affaire " +
        "WHERE Detenu.n_ecrou = '" + req.body.n_ecrou + "' AND Affaire.n_affaire = '" + req.body.n_affaire + "'",

        "INSERT INTO Incarceration (n_ecrou, n_affaire, nom_juridiction, n_motif) " +
        "SELECT Detenu_Affaire.n_ecrou, Detenu_Affaire.n_affaire, Detenu_Affaire.nom_juridiction, Motif.n_motif " +
        "FROM Detenu_Affaire, Motif " +
        "WHERE Detenu_Affaire.n_ecrou = '" + req.body.n_ecrou + "' AND Motif.n_motif = '" + req.body.n_motif + "'",

        "UPDATE Incarceration SET date_incarceration = '" + req.body.date_incarceration + "' WHERE n_ecrou = '" + req.body.n_ecrou + "'"
    ]

    /* création du tableau des données pour exécution batch du SQL */
    let data = [detenu, affaire, motif, null, null, null];

    /* exécution du batch et affichage du résultat */
    logger.infoCreateDetenu(req.body.n_ecrou);
    executeBatch(req, res, arr, data);
    logger.infoIncarcerationSuccess();
    res.redirect('/');
})

/*
   Cette fonction permet d'exécuter plusieurs requêtes SQL l'une après l'autre en utilisant
   méthode de sérialisation ce que garanti un ordre d'exécution.
   @param: {HTTP Request} req - request
   @param: {HTTP Response} res - response
   @param: {Array} queries - les requêtes
   @param: {Array} form - les données
 */
function executeBatch(req, res, queries, form) {
    dbConn.serialize(() => {
        dbConn.run('BEGIN TRANSACTION;');
        queries.forEach((query, index) => {
            logger.infoBatchExecution(index);
            let data = form[index]
            if (data !== null && data !== 'undefined') {
                /* si les données ne sont pas vides, alors exécuter les requêtes comprenant les données */
                dbConn.run(query, data, err => {
                    if (err) handleError(req, res, err);
                })
            } else {
                /* si les données sont vides, alors exécuter les requêtes simples */
                dbConn.run(query, err => {
                    if (err) handleError(req, res, err);
                })
            }
        })
        dbConn.run("COMMIT");
    })
    logger.infoValidationOfModifications();
}

function handleError(req, res, ex) {
    let erreurMsg = ex.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "L'incarcéré avec le numéro " + req.body.n_ecrou + " déjà existe." : ex;
    req.flash('error', erreurMsg)
}

/* initialiser la page de modification des informations */
router.get('/edit/(:n_ecrou)', function (req, res, next) {
    let n_ecrou = req.params.n_ecrou;
    let query = "SELECT * FROM Detenu d JOIN Incarceration incr1 ON d.n_ecrou = incr1.n_ecrou AND d.n_ecrou = '" + n_ecrou + "'";
    dbConn.all(query, function (err, rows) {
        if (err) throw err
        res.render('pages/edit', rows[0])
    })
})

/* mettre à jour les données */
router.post('/update/:n_ecrou', function (req, res, next) {
    let options = {
        n_ecrou: req.params.n_ecrou,
        prenom: req.body.prenom,
        nom: req.body.nom,
        date_naissance: req.body.date_naissance,
        lieu_naissance: req.body.lieu_naissance,
        date_incarceration: req.body.date_incarceration
    }

    if (req.body.canceled) {
        res.redirect('/');
        return;
    }

    if (options["date_incarceration"] <= options["date_naissance"]) {
        req.flash('error', "La date d'incarceration ne peut pas être inférieure ou égale à la date de naissance.");
        res.render('pages/add', options);
        return;
    }

    /* vérifier si les champs sont vides */
    if (!allFieldsAreSet(options)) {
        req.flash('error', "Veuillez saisir les modifications.");
        res.render('pages/edit', options)
        return;
    }

    var form_data = {
        $prenom: req.body.prenom,
        $nom: req.body.nom,
        $date_naissance: req.body.date_naissance,
        $lieu_naissance: req.body.lieu_naissance,
    }

    let arr = [
        "UPDATE Detenu SET prenom = $prenom, nom = $nom, date_naissance = $date_naissance, lieu_naissance = $lieu_naissance WHERE n_ecrou = '" + req.params.n_ecrou + "'",
        "UPDATE Incarceration SET date_incarceration = '" + req.body.date_incarceration + "' WHERE n_ecrou = '" + req.params.n_ecrou + "'"
    ]

    let data = [form_data, null];
    logger.infoUpdateQuery(" pour l'incarcéré numéro " + req.params.n_ecrou + "...");
    executeBatch(req, res, arr, data);
    req.flash('success', 'Les informtions ont été bien mises à jour.');
    logger.infoUpdateSuccess();
    res.redirect('/');
})

router.get('/delete/(:n_ecrou)', function (req, res, next) {
    /* prendre n_ecrou du détenu */
    let n_ecrou = req.params.n_ecrou;
    logger.infoDelete("liés au détenu " + n_ecrou + " ...");
    /* création du tableau des commandes pour exécution batch du SQL */
    let arr = [
        "DELETE FROM Incarceration WHERE n_ecrou = '" + n_ecrou + "'",
        "DELETE FROM Detenu_Affaire WHERE n_ecrou = '" + n_ecrou + "'",
        "DELETE FROM Detenu WHERE n_ecrou = '" + n_ecrou + "'",
    ]
    /* supprimer les données */
    executeBatch(req, res, arr, [null, null, null, null]);
    /* affichage du résultat */
    req.flash('success', 'Enregistrement avec numéro d\'écrou ' + n_ecrou + ' a été bien supprimé.');
    logger.infoDeleteSuccess();
    res.redirect('/')
})

function allFieldsAreSet(fields) {
    for (let key in fields) {
        if (fields[key].length === 0)
            return false;
    }
    return true;
}

module.exports = router;