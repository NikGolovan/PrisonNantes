var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
var common = require('../public/javascripts/core/common_functions');
var Detenu = require('../public/javascripts/core/detenu');

// display books page
router.get('/', function(req, res, next) {
  let query = 'SELECT * FROM Detenu ORDER BY n_ecrou desc';
  common.initTableData(query, 'pages', this.data, req, res);
});

// display add book page
router.get('/add', function(req, res, next) {
  var options = { n_ecrou: '',  prenom: '', nom: '', date_naissance: '',  lieu_naissance: '', canceled: '' };
  common.renderPage('pages/add', options, req, res, null, null);
});

// delete book
router.get('/delete/(:n_ecrou)', function(req, res, next) {
  let query = 'DELETE FROM Detenu WHERE n_ecrou = ' + req.params.n_ecrou;
  let success_message = 'Enregistrement avec numéro d\'écrou ' + req.params.n_ecrou + ' a été bien supprimé.';
  common.deleteRecord(query, '/', success_message, req, res)
})

// add a new book
router.post('/add', function(req, res, next) {
  let query = 'INSERT INTO Detenu values ($n_ecrou, $prenom, $nom, $date_naissance, $lieu_naissance)';
  let success_message = 'Nouveau détenu a été bien enregistré.';
  let err_msg = 'Le détenu avec numéro d\'écrou ' + req.body.n_ecrou + ' déjà existe.';
  let detenu = new Detenu(req.body.n_ecrou, req.body.prenom, req.body.nom, req.body.date_naissance, req.body.lieu_naissance);

  var form_data = {
    $n_ecrou: req.body.n_ecrou,
    $prenom: req.body.prenom,
    $nom: req.body.nom,
    $date_naissance: req.body.date_naissance,
    $lieu_naissance: req.body.lieu_naissance
  }

  if (req.body.canceled) {
    res.redirect('/');
    return;
  }

  if(!common.allFieldsAreFilled(detenu)) {
    common.renderPage('pages/add', detenu, req, res, 'Veuillez saisir tous les champs.', 'error');
    return;
  }
  common.execQuery(query, 'pages/add', detenu, form_data, err_msg, success_message, req, res);
})

// display edit book page
router.get('/edit/(:n_ecrou)', function(req, res, next) {
  let n_ecrou = req.params.n_ecrou;
  let query = 'SELECT * FROM Detenu WHERE n_ecrou = ' + n_ecrou;

  dbConn.all(query, function(err, rows, fields) {
    if (err) throw err
    if (rows.length <= 0) {
      req.flash('error', 'Pas de détenu avec n_ecrou = ' + n_ecrou)
      res.redirect('/')
    } else {
      res.render('pages/edit', {
        title: 'Modifier Information',
        n_ecrou: rows[0].n_ecrou,
        prenom: rows[0].prenom,
        nom: rows[0].nom,
        date_naissance: rows[0].date_naissance,
        lieu_naissance: rows[0].lieu_naissance,
        canceled: ''
      })
    }
  })
})

// update book data
router.post('/update/:n_ecrou', function(req, res, next) {
  let query = 'UPDATE Detenu SET prenom = $prenom, nom = $nom, date_naissance = $date_naissance, lieu_naissance = $lieu_naissance WHERE n_ecrou = ' + req.params.n_ecrou;
  let success_message = 'Les informtions ont été bien mises à jour.';
  let detenu = new Detenu(req.params.n_ecrou, req.body.prenom, req.body.nom, req.body.date_naissance, req.body.lieu_naissance);

  var form_data = {
    $nom: req.body.nom,
    $prenom: req.body.prenom,
    $date_naissance: req.body.date_naissance,
    $lieu_naissance: req.body.lieu_naissance
  }

  if (req.body.canceled) {
    res.redirect('/');
    return;
  }

  if(!common.allFieldsAreFilled(detenu)) {
    common.renderPage('pages/edit', detenu, req, res, 'Veuillez saisir les modifications.', 'error');
    return;
  }
  common.execQuery(query, 'pages/edit', detenu, form_data, '', success_message, req, res);
})

module.exports = router;