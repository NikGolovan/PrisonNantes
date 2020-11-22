/*
    La classe Detenu
 */
const Detenu = function (options) {
    this.n_ecrou = options.n_ecrou;
    this.prenom = options.prenom;
    this.nom = options.nom;
    this.date_naissance = options.date_naissance;
    this.lieu_naissance = options.lieu_naissance;
}

const detenu = new Detenu({n_ecrou: 1, prenom: 'Prenom', nom: 'Nom', date_naissance: '3/3/3', lieu_naissance: 'France'});
console.log(detenu);

