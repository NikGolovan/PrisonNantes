/*
    La classe Motif
 */
const Motif = function (options) {
    this.n_motif = options.n_motif;
    this.libelle_motif = options.libelle_motif;
}

const motif = new Motif({n_motif: 1, libelle_motif: 'libelle motif'});
console.log(motif);
