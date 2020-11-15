/*
    La classe Juridiction
 */
const Juridiction = function (options) {
    this.nom_juridiction = options.nom_juridiction;
}

const juridiction = new Juridiction({nom_juridiction: 'nom juridiction'});
console.log(juridiction);

