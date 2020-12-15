/*
    La classe Affaire
 */
const Affaire = function (options) {
    this.$n_affaire = options.n_affaire;
    this.$nom_juridiction = options.nom_juridiction;
    this.$date_faits = options.date_faits;
}

module.exports = Affaire;
