/*
    Heritage de la class Decision par la classe Reduction_peine
 */
const Reduction_peine = function (options) {
    Decision.apply(this, arguments);
    this.typeDecision = 2; /* redéfinir le type de décision de la classe Decision  */
    this.duree = options.duree;
}
/* redéfinir le prototype de la classe Decision */
Reduction_peine.prototype = Object.create(Decision.prototype);
/* pointer vers le constructeur de la classe Reduction_peine et pas Decision */
Reduction_peine.prototype.constructor = Reduction_peine;

/* création d'instance de la classe Reduction_peine */
const reduction_peine = new Reduction_peine({duree: 3});

console.log(reduction_peine);