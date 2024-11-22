'use strict';

var crcCache = [];

let checkCrc = function(res) {
    while (crcCache.indexOf(res) > -1) {
        res++;
    }
    return res;
}

let thisAdd = function(value) {
    crcCache.push(value);
}

exports.add = thisAdd;
exports.check = checkCrc;
