/*
    La classe Affaire
 */
const Affaire = function (options) {
    this.n_affaire = options.n_affaire;
    this.date_faits = options.date_faits;
}

const affaire = new Affaire({n_affaire: 1, date_faits: '3/3/3'});
console.log(affaire);

