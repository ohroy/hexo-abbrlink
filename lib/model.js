'use strict';

var crcCache = new Set();
var postAbbrlinkCache = new Map();

// ensure that every Abbrlink is unique
let uniqueCrc = function(res) {
    while (crcCache.has(res)) {
        res++;
    }
    crcCache.add(res);
    return res;
}
exports.uniqueAbbrlink = uniqueCrc;


// post abbrlink cache
let isPostProcessed = function(postPath) {
    return postAbbrlinkCache.has(postPath);
}
let cachePostAbbrlink = function(postPath, abbrlink) {
    postAbbrlinkCache.set(postPath, abbrlink);
}
let getPostAbbrlink = function(postPath) {
    return postAbbrlinkCache.get(postPath);
}
exports.isPostProcessed = isPostProcessed;
exports.cachePostAbbrlink = cachePostAbbrlink;
exports.getPostAbbrlink = getPostAbbrlink;
