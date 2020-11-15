/*
    Heritage de la class Decision par la classe Liberation_definitive
 */
const Liberation_definitive = function (options) {
    Decision.apply(this, arguments);
    this.typeDecision = 3; /* redéfinir le type de décision de la classe Decision  */
    this.date_liberation = options.date_liberation;
}
/* redéfinir le prototype de la classe Decision */
Liberation_definitive.prototype = Object.create(Decision.prototype);
/* pointer vers le constructeur de la classe Liberation_definitive et pas Decision */
Liberation_definitive.prototype.constructor = Liberation_definitive;

/* création d'instance de la classe Liberation_definitive */
const liberation_definitive = new Liberation_definitive({date_liberation: '3/3/3'});

console.log(liberation_definitive);