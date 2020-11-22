/*
    La classe Detenu
 */
const Detenu = function (n_ecrou, prenom, nom, date_naissance, lieu_naissance) {
    this.n_ecrou = n_ecrou;
    this.prenom = prenom;
    this.nom = nom;
    this.date_naissance = date_naissance;
    this.lieu_naissance = lieu_naissance;
}

module.exports = Detenu;
