'use strict';

// ensure that every Abbrlink is unique
var crcCache = new Set();
let uniqueCrc = function(res) {
    while (crcCache.has(res)) {
        res++;
    }
    crcCache.add(res);
    return res;
}
let recordExistingCrc = function(crc) {
    crcCache.add(crc);
}
exports.recordExistingAbbrlink = recordExistingCrc;
exports.uniqueAbbrlink = uniqueCrc;


// post generated abbrlink cache
var postAbbrlinkCache = new Map();
let cacheGeneratedAbbrlink = function(postPath, abbrlink) {
    postAbbrlinkCache.set(postPath, abbrlink);
}
let getGeneratedAbbrlink = function(postPath) {
    return postAbbrlinkCache.get(postPath);
}
exports.cacheGeneratedAbbrlink = cacheGeneratedAbbrlink;
exports.getGeneratedAbbrlink = getGeneratedAbbrlink;


// processed post record
var processedPosts = new Set();
let isPostProcessed = function(postPath) {
    return processedPosts.has(postPath);
}
let setPostProcessed = function(postPath) {
    processedPosts.add(postPath);
}
exports.isPostProcessed = isPostProcessed;
exports.setPostProcessed = setPostProcessed;