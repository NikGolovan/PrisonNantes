/*
    Heritage de la class Decision par la classe Condamnation
 */
const Condamnation = function (options) {
    Decision.apply(this, arguments);
    /* Redéfinir le type de décision de la classe Decision  */
    this.typeDecision = 1;
    this.duree = options.duree;
}
/* Redéfinir le prototype de la classe Decision */
Condamnation.prototype = Object.create(Decision.prototype);
/* Pointer vers le constructeur de la classe Condamnation et pas Decision */
Condamnation.prototype.constructor = Condamnation;

/* Création d'instance de la classe Condamnation */
const condamnation = new Condamnation({duree: 2});

console.log(condamnation);