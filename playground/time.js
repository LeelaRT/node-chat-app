const moment = require('moment');

var date = moment();

console.log(date.format('h:mm a'));
console.log(date.format('Do MMM YYYY hh:mm:ss a'));
console.log(date.format('DD MMM YYYY hh:mm:ss a'));
console.log(date.format('DD/MM/YYYY hh:mm:ss a'));

var createdAt = 1234;
var d1 = moment(createdAt);
console.log(d1.format('hh:mm a'));
