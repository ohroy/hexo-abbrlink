'use strict';

var crcRes = [];

let checKCrc = function(res) {
    if (crcRes.indexOf(res) > -1) {
        res++;
        return checKCrc(res);
    } else {
        return res;
    }

}

let thisAdd = function(value) {
    crcRes.push(value);
}

exports.add = thisAdd;
exports.check = checKCrc;
