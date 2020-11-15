var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');

// display books page
router.get('/', function(req, res, next) {

  dbConn.all('SELECT * FROM Detenu ORDER BY n_ecrou desc',function(err,rows)     {

    if(err) {
      req.flash('error', err);
      // render to views/books/index.ejs
      res.render('pages',{data:''});
    } else {
      // render to views/books/index.ejs
      res.render('pages',{data:rows});
    }
  });
});

// display add book page
router.get('/add', function(req, res, next) {
  // render to add.ejs
  res.render('pages/add', {
    n_ecrou: '',
    prenom: '',
    nom: '',
    date_naissance: '',
    lieu_naissance: '',
    canceled: ''
  })
})

// add a new book
router.post('/add', function(req, res, next) {
  let n_ecrou = req.body.n_ecrou;
  let prenom = req.body.prenom;
  let nom = req.body.nom;
  let date_naissance = req.body.date_naissance;
  let lieu_naissance = req.body.lieu_naissance;
  let canceled = req.body.canceled;

  let errors = false;

  if (canceled) {
    res.redirect('/');
    return;
  }

  if(n_ecrou.length === 0 || prenom.length === 0 ||
      nom.length === 0 || date_naissance.length === 0 || lieu_naissance.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', "Veuillez saisir tous les champs.");
    // render to add.ejs with flash message
    res.render('pages/add', {
      n_ecrou: n_ecrou,
      nom: nom,
      prenom: prenom,
      date_naissance: date_naissance,
      lieu_naissance: lieu_naissance
    })
  }

  // if no error
  if(!errors) {

    var form_data = {
      $n_ecrou: n_ecrou,
      $prenom: prenom,
      $nom: nom,
      $date_naissance: date_naissance,
      $lieu_naissance: lieu_naissance
    }

    // insert query
    dbConn.all('INSERT INTO Detenu values ($n_ecrou, $prenom, $nom, $date_naissance, $lieu_naissance)', form_data, function(err, result) {
      //if(err) throw err
      if (err) {
        let erreurMsg = err.toString().indexOf('UNIQUE CONSTRAINT FAILED') ? "Le détenu avec le numéro d'écrou " + n_ecrou + " déjà existe." : err;
        req.flash('error', erreurMsg)
        // render to add.ejs
        res.render('pages/add', {
          n_ecrou: form_data.n_ecrou,
          prenom: form_data.prenom,
          nom: form_data.nom,
          date_naissance: form_data.date_naissance,
          lieu_naissance: form_data.lieu_naissance
        })
      } else {
        req.flash('success', 'Nouveau détenu a été bien enregistré.');
        res.redirect('/');
      }
    })
  }
})

// display edit book page
router.get('/edit/(:n_ecrou)', function(req, res, next) {

  let n_ecrou = req.params.n_ecrou;

  dbConn.all('SELECT * FROM Detenu WHERE n_ecrou = ' + n_ecrou, function(err, rows, fields) {
    if(err) throw err

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

  let n_ecrou = req.params.n_ecrou;
  let prenom = req.body.prenom;
  let nom = req.body.nom;
  let date_naissance = req.body.date_naissance;
  let lieu_naissance = req.body.lieu_naissance;
  let canceled = req.body.canceled;
  let errors = false;

  if (canceled) {
    res.redirect('/');
    return;
  }

  if(n_ecrou.length === 0 || prenom.length === 0 ||
      nom.length === 0 || date_naissance.length === 0 || lieu_naissance.length === 0) {
    errors = true;

    // set flash message
    req.flash('error', "Veuillez saisir les modifications.");
    // render to add.ejs with flash message
    res.render('pages/edit', {
      n_ecrou: req.params.n_ecrou,
      nom: nom,
      prenom: prenom,
      date_naissance: date_naissance,
      lieu_naissance: lieu_naissance
    })
  }

  // if no error
  if( !errors ) {

    var form_data = {
      $prenom: prenom,
      $nom: nom,
      $date_naissance: date_naissance,
      $lieu_naissance: lieu_naissance
    }
    // update query
    dbConn.run('UPDATE Detenu SET prenom = $prenom, nom = $nom, date_naissance = $date_naissance, lieu_naissance = $lieu_naissance WHERE n_ecrou = ' + n_ecrou, form_data, function(err, result) {
      //if(err) throw err
      if (err) {
        // set flash message
        req.flash('error', err)
        // render to edit.ejs
        res.render('pages/edit', {
          n_ecrou: req.params.n_ecrou,
          nom: nom,
          prenom: prenom,
          date_naissance: date_naissance,
          lieu_naissance: lieu_naissance
        })
      } else {
        req.flash('success', 'Les informtions ont été bien mises à jour.');
        res.redirect('/');
      }
    })
  }
})

// delete book
router.get('/delete/(:n_ecrou)', function(req, res, next) {

  let n_ecrou = req.params.n_ecrou;

  dbConn.all('DELETE FROM Detenu WHERE n_ecrou = ' + n_ecrou, function(err, result) {
    //if(err) throw err
    if (err) {
      // set flash message
      req.flash('error', err)
      // redirect to books page
      res.redirect('/')
    } else {
      // set flash message
      req.flash('success', 'Enregistrement avec numéro d\'écrou ' + n_ecrou + ' a été bien supprimé.');
      // redirect to books page
      res.redirect('/')
    }
  })
})

module.exports = router;