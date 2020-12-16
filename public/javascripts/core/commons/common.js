/*
    Ce fichier contient les fonctions communes pour tous les fichiers.
    Ils sont regroupés ici car cela évite de les déclarer de nouveau dans chaque fichier
    qui besoin de ces fonctionnalités.
 */

const Common = function () {
    /*
        Cette fonction vérifié si les dates sont valides.
        Variable startDate doit être inférieure à variable endDate.
        Cela peut être utile pour comparaison de date de naissance
        avec la date d'incarcération, par exemple.
        @param: {String} startDate - la date de début
        @param: {String} endDate - la date de fin
        @return: {Boolean} vrai/faux
     */
    this.twoDatesAreNotValid = function (startDate, endDate) {
        return startDate <= endDate;
    }

    /*
        Cette fonction vérifié si tous les champs ont ete été remplis.
        @param: {Array} fields - les champs du formulaire
     */
    this.allFieldsAreSet = function (fields) {
        for (let key in fields) {
            if (fields[key].length === 0)
                return false;
        }
        return true;
    }
}

const common = new Common();

module.exports = common;