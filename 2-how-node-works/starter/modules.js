// console.log(arguments);
// console.log(require('module').wrapper);


const C = require('./test-module-1');
// const calc2 = require('./test-module-2');
const {add, multiply, divide} = require('./test-module-2');
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();

const calc1 = new C();

// console.log(calc1.add(2, 5));
// console.log(add(2, 5));
