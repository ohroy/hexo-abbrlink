'use strict';

var hexo = hexo || {};

let generator = require('./lib/logic')

// ensure to be firstly executed
hexo.extend.filter.register('post_permalink', generator.generateAbbrlink, 1);
hexo.extend.filter.register('before_post_render', generator.writebackToFiles, 1);