/*
    La classe Detenu
 */
const Detenu = function (options) {
    this.$n_ecrou = options.n_ecrou;
    this.$prenom = options.prenom;
    this.$nom = options.nom;
    this.$date_naissance = options.date_naissance;
    this.$lieu_naissance = options.lieu_naissance;
}

module.exports = Detenu;
