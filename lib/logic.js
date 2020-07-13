'use strict';

var crc16 = require('./crc16');
var crc32 = require('./crc32');
var model = require('./model');
var front = require('hexo-front-matter');
var fs = require('hexo-fs');

function org_get_abbrlink(data) {
    var r = data.content.match(/#\+ABBRLINK:.*\n/);
    if (r) {
        data.abbrlink = r[0].split(':')[1].trim();
    } else {
        data.abbrlink = '';
    }
    return data;
}

let logic = function (data) {
    var log = this.log;
    const config = this.config.abbrlink || {};
    //+++ Draft processing
    var opt_drafts = this.config.abbrlink && this.config.abbrlink.drafts ? this.config.abbrlink.drafts : false;
    if (opt_drafts == false) {
        if (!this.config.render_drafts && data.source.startsWith('_drafts/')) return data;
    }
    //+++
    if (data.layout == 'post') {
        let abbrlink;
        if (!/.*\.org/.test(data.source)) {
            abbrlink = data.abbrlink;
        } else {
            abbrlink = org_get_abbrlink(data).abbrlink;
        }
        if (!abbrlink || config.force) {
            var opt_alg = this.config.abbrlink && this.config.abbrlink.alg ? this.config.abbrlink.alg : 'crc16';
            var opt_rep = this.config.abbrlink && this.config.abbrlink.rep ? this.config.abbrlink.rep : 'dec';

            let res = opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0;
            //check this abbrlink is already exist then get a different one
            abbrlink = model.check(res);
            //set abbrlink to hex or dec
            abbrlink = opt_rep == 'hex' ? abbrlink.toString(16) : abbrlink;
            data.abbrlink = abbrlink;
            let postStr;
            if (!/.*\.org/.test(data.source)) {
                //re parse front matter
                var tmpPost = front.parse(data.raw);
                //add new generated link
                tmpPost.abbrlink = abbrlink;

                // ------ auto title ?
                if (this.config.abbrlink && this.config.abbrlink.auto_title && !tmpPost.title) {
                    // maybe the title is path/to/something.md
                    // so we split / first and split . again
                    const pathParts = data.source.split('/');
                    let last = pathParts[pathParts.length - 1];
                    const endPort = last.indexOf('.');
                    if (endPort > -1) {
                        last = last.substring(0, endPort);
                    }
                    tmpPost.title = last;

                    log.i('Generated: title [%s] for post [ %s ]', tmpPost.title, data.full_source);
                }
                // ----- auto date ? easy
                if (this.config.abbrlink && this.config.abbrlink.auto_date && !tmpPost.date) {
                    tmpPost.date = data.date.format('YYYY-MM-DD HH:mm:ss');
                    log.i('Generated: date [%s] for post [ %s ]', tmpPost.date, data.full_source);
                }
                //+++
                //From: hexo-auto-category
                //see:https://github.com/xu-song/hexo-auto-category
                //File: hexo-auto-category\lib\logic.js
                var opt_AutoCategoryEnable = config.auto_category && config.auto_category.enable;
                var overwrite = config.auto_category && config.auto_category.over_write;
                if (opt_AutoCategoryEnable && overwrite) {
                    var categories = data.source.split('/');
                    var opt_AutoCategoryDepth = config.auto_category.depth || 3;
                    var depth = opt_AutoCategoryDepth || categories.length - 2;
                    if (categories.length - 2 == 0 || depth == 0) {
                        tmpPost.categories = this.config.default_category;
                    } else {
                        var newCategories = categories.slice(1, 1 + Math.min(depth, categories.length - 2));
                        //prevents duplicate file changes
                        if (
                            !Array.isArray(tmpPost.categories) ||
                            !tmpPost.categories.join('_') == newCategories.join('_')
                        ) {
                            tmpPost.categories = newCategories;
                        }
                    }
                }
                //+++
                //process post
                postStr = front.stringify(tmpPost);
                postStr = '---\n' + postStr;
                fs.writeFileSync(data.full_source, postStr, 'utf-8');
            } else {
                postStr = data.raw.split('\n');
                postStr.splice(2, 0, '#+ABBRLINK: ' + abbrlink);
                fs.writeFileSync(data.full_source, postStr.join('\n'), 'utf-8');
            }
            if (data.source.startsWith('_drafts/')) {
                // is draft //
                if (data.title.length == 0)
                    log.i('No title found for draft [source/_drafts/%s.md][ %s ]', data.slug, data.title);
                log.i('Generate link [%s] for draft [source/_drafts/%s.md][ %s ]', abbrlink, data.slug, data.title);
                //+++
                //From: hexo-auto-category
                //see:https://github.com/xu-song/hexo-auto-category
                //File: hexo-auto-category\lib\logic.js
                log.i(
                    'Generated: categories [%s] for draft [source/_drafts/%s.md][ %s ]',
                    tmpPost.categories,
                    data.slug,
                    data.title
                );
                //+++
            } else {
                // is not draft //
                if (data.title.length == 0)
                    log.i('No title found for post [source/_posts/%s.md][ %s ]', data.slug, data.title);
                log.i('Generate link [%s] for post [source/_posts/%s.md][ %s ]', abbrlink, data.slug, data.title);
                //+++
                //From: hexo-auto-category
                //see:https://github.com/xu-song/hexo-auto-category
                //File: hexo-auto-category\lib\logic.js
                log.i(
                    'Generated: categories [%s] for post [source/_posts/%s.md][ %s ]',
                    tmpPost.categories,
                    data.slug,
                    data.title
                );
                //+++
            }
        }
        model.add(abbrlink);
    }
    return data;
};

module.exports = logic;
