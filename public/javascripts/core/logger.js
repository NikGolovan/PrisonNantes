/*
    Ce fichier représente l'affichage des informations dans le console,
    tels que execution des requêtes SQL, données, les actions etc.
 */

const Logger = function () {
    const prefix = "\x1b[34m"; /* couleur bleu pour le texte dans la console */

    /* Affichage dans le console information que la requête SQL est en cours d'exécution.  */
    this.infoExecQuery = function () {
        console.log(prefix, "[INFO] ==> Exécution de la requête SQL...");
    }

    /*
        Affichage dans le console le mise à jour des informations.
        @param: {String} param - le numéro du détenu/condamné/incarcéré
    */
    this.infoUpdateQuery = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefix, "[INFO] ==> Mise à jour des informations" + param);
    }

    /* Affichage dans le console information sur le success de la requête SQL.  */
    this.infoUpdateSuccess = function () {
        console.log(prefix, "[INFO] ==> Les modifications ont été bien prises en compte.");
    }

    /*
        Affichage dans le console information sur suppression des données.
        @param: {String} param - le numéro du détenu/condamné/incarcéré
    */
    this.infoDelete = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefix, "[INFO] ==> Suppression des données" + param);
    }

    /* Affichage dans le console information sur le success de la requête SQL.  */
    this.infoDeleteSuccess = function () {
        console.log(prefix, "[INFO] ==> Les données ont été bien supprimées.");
    }

    /* Affichage dans le console information sur la validation des données.  */
    this.infoValidationOfModifications = function () {
        console.log(prefix, "[INFO] ==> Validation des modifications...");
    }

    /*
        Affichage d'exécution batch de plusieurs requêtes SQL.
        @param: {String} param - le numéro de la requête
    */
    this.infoBatchExecution = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefix, "[INFO] ==> Execution du batch... traitement de la requête SQL [" + param + "]");
    }

    /* Affichage dans le console information sur le success de la requête SQL. */
    this.infoIncarcerationSuccess = function () {
        console.log(prefix, "[INFO] ==> Nouveau détenu a été bien incarcéré.");
    }

    /*
        Affichage d'information sur la création d'un nouveau incarcéré .
        @param: {String} param - le numéro d'incarcéré
    */
    this.infoCreateDetenu = function (param) {
        param = (param === null) ? "(?)" : param;
        console.log(prefix, "[INFO] ==> Incarcération du détenu avec le numéro " + param + " ...");
    }
}

module.exports = Logger;
