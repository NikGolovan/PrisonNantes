/*
    La classe Incarceration
 */
const Incarceration = function (options) {
    this.date_incarceration = options.date_incarceration;
}

const incarceration = new Incarceration({date_incarceration: '3/3/3'});
console.log(incarceration);
