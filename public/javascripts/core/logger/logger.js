/*
    Ce fichier représente l'affichage des informations dans le console,
    tels que execution des requêtes SQL, données, les actions etc.
 */

const Logger = function () {
    const prefixInfo = "\x1b[34m"; /* couleur bleu pour le texte dans la console */

    /* Affichage dans le console information que la requête SQL est en cours d'exécution.  */
    this.infoExecQuery = function () {
        console.log(prefixInfo, "[INFO] ==> Exécution de la requête SQL...");
    }

    /*
        Affichage dans le console le mise à jour des informations.
        @param: {String} param - le numéro du détenu/condamné/incarcéré
    */
    this.infoUpdateQuery = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefixInfo, "[INFO] ==> Mise à jour des informations" + param);
    }

    /* Affichage dans le console information sur le success de la requête SQL.  */
    this.infoUpdateSuccess = function () {
        console.log(prefixInfo, "[INFO] ==> Les modifications ont été bien prises en compte.");
    }

    /*
        Affichage dans le console information sur suppression des données.
        @param: {String} param - le numéro du détenu/condamné/incarcéré
    */
    this.infoDelete = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefixInfo, "[INFO] ==> Suppression des données" + param);
    }

    /* Affichage dans le console information sur le success de la requête SQL.  */
    this.infoDeleteSuccess = function () {
        console.log(prefixInfo, "[INFO] ==> Les données ont été bien supprimées.");
    }

    /* Affichage dans le console information sur la validation des données.  */
    this.infoValidationOfModifications = function () {
        console.log(prefixInfo, "[INFO] ==> Validation des modifications...");
    }

    /*
        Affichage d'exécution batch de plusieurs requêtes SQL.
        @param: {String} param - le numéro de la requête
    */
    this.infoBatchExecution = function (param) {
        param = (param === null) ? "..." : param;
        console.log(prefixInfo, "[INFO] ==> Execution du batch... traitement de la requête SQL [" + param + "]");
    }

    /* Affichage dans le console information sur le success de la requête SQL. */
    this.infoIncarcerationSuccess = function () {
        console.log(prefixInfo, "[INFO] ==> Nouveau détenu a été bien incarcéré.");
    }

    /*
        Affichage d'information sur la création d'un nouveau incarcéré.
        @param: {String} param - le numéro d'incarcéré
    */
    this.infoCreateDetenu = function (param) {
        param = (param === null) ? " " : param;
        console.log(prefixInfo, "[INFO] ==> Incarcération du détenu avec le numéro " + param + " ...");
    }

    /*
        Affichage d'information sur la création d'une nouvelle réduction de peine.
        @param: {String} param - le numéro de condamné
    */
    this.infoCreateReductionPeine = function (param) {
        param = (param === null) ? " " : param;
        console.log(prefixInfo, "[INFO] ==> Insertion d'une nouvelle reduction de peine pour condamné " + param);
    }

    /*
        Affichage d'information sur le success de réduction de peine.
        @param: {String} param - le numéro de condamné
    */
    this.infoReductionPeineSuccess = function (param) {
        param = (param === null) ? " " : param;
        console.log(prefixInfo, "[INFO] ==> La peine pour condamné " + param + " a été bien réduite.");
    }

    /*
        Affichage d'information sur le success de condamnation.
        @param: {String} param - le numéro de détenu
    */
    this.infoCondamnationSuccess = function (param) {
        param = (param === null) ? " " : param;
        console.log(prefixInfo, "[INFO] ==> Détenu " + param + " a été bien condamné.");
    }

    /*
        Affichage d'information sur la creation d'une nouvelle condamnation.
        @param: {String} param - le numéro de détenu
    */
    this.infoCreateCondamnation = function (param) {
        param = (param === null) ? " " : param;
        console.log(prefixInfo, "[INFO] ==> Condamnation du détenu " + param + "...");
    }

    /*
        Affichage d'information sur la création d'une nouvelle liberation.
        @param: {String} param - le numéro du détenu
    */
    this.infoCreateLiberation = function (param) {
        param = (param === null) ? "." : param;
        console.log(prefixInfo, "[INFO] ==> Liberation définitive du détenu " + param);
    }

    /*
        Affichage d'information sur le success de libération.
    */
    this.infoLiberationSuccess = function () {
        console.log(prefixInfo, "[INFO] ==> Le détenu a été bien libéré.");
    }
}

const logger = new Logger();

module.exports = logger;
