var crc = require('./lib/crc16');

var other = crc("123");
var crcRes=[];
crcRes.push(other);
console.log(other);
console.log(crcRes.indexOf(other));