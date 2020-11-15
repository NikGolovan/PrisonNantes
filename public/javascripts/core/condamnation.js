/*
    Heritage de la class Decision par la classe Condamnation
 */
const Condamnation = function (options) {
    Decision.apply(this, arguments);
    this.typeDecision = 1; /* redéfinir le type de décision de la classe Decision  */
    this.duree = options.duree;
}
/* redéfinir le prototype de la classe Decision */
Condamnation.prototype = Object.create(Decision.prototype);
/* pointer vers le constructeur de la classe Condamnation et pas Decision */
Condamnation.prototype.constructor = Condamnation;

/* création d'instance de la classe Condamnation */
const condamnation = new Condamnation({duree: 2});

console.log(condamnation);