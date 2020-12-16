/*
    Heritage de la class Decision par la classe Liberation_definitive
 */
const Liberation_definitive = function (options) {
    Decision.apply(this, arguments);
    /* Redéfinir le type de décision de la classe Decision  */
    this.$typeDecision = 3;
    this.$date_liberation = options.date_liberation;
}
/* Redéfinir le prototype de la classe Decision */
Liberation_definitive.prototype = Object.create(Decision.prototype);
/* Pointer vers le constructeur de la classe Liberation_definitive et pas Decision */
Liberation_definitive.prototype.constructor = Liberation_definitive;

module.exports = Liberation_definitive;