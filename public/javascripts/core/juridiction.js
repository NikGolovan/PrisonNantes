/*
    La classe Juridiction
 */
const Juridiction = function (options) {
    this.nom_juridiction = options.nom_juridiction;
    this.n_affaire = options.n_affaire;
}

const juridiction = new Juridiction({n_affaire: 1, nom_juridiction: 'nom juridiction'});
console.log(juridiction);

