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
        // if (!abbrlink || abbrlink == '0' || config.force) {
        let root_path = data.source.startsWith('_drafts/') ? 'source/_drafts' : 'source/_posts'

        //re parse front matter
        var tmpPost = front.parse(data.raw);

        // ------ auto title ?
        if (this.config.abbrlink && this.config.abbrlink.auto_title && !tmpPost.title) {
            // maybe the title is path/to/something.md
            // so we split / first and split . again
            const pathParts = data.source.split('/');
            let last = pathParts[pathParts.length - 1];
            let last2 = pathParts[pathParts.length - 2];

            const endPort2 = last2.lastIndexOf('.');
            var last2tail = ''
            var last2front = ''
            if (endPort2 > -1) {
                last2tail = last2.substring(endPort2 + 1);
                last2front = last2.substring(0, endPort2);
            }
            if (last2tail == 'textbundle'){
                tmpPost.title = last2front;
            } else {
                const endPort = last.indexOf('.');
                if (endPort > -1) {
                    last = last.substring(0, endPort);
                }
                tmpPost.title = last;
            }
            if (data.title.length == 0)
                log.i('No title [%s] in post [ %s ]', data.title, data.full_source);
            log.i('Generated: title [%s] for post [ %s ]', tmpPost.title, data.full_source);
        }

        // ----- auto date ? easy
        if (this.config.abbrlink && this.config.abbrlink.auto_date && !tmpPost.date) {
            tmpPost.date = data.date.format('YYYY-MM-DD HH:mm:ss');
            log.i('Generated: date [%s] for post [ %s ]', tmpPost.date, data.full_source);
        }

        //From: hexo-auto-category
        //see:https://github.com/xu-song/hexo-auto-category
        //File: hexo-auto-category\lib\logic.js
        var opt_AutoCategoryEnable = config.auto_category && config.auto_category.enable;
        var overwrite = config.auto_category && config.auto_category.over_write;
        if (opt_AutoCategoryEnable && overwrite) {
            var categories = data.source.split('/');

            if (categories.length - 2 >= 0) {
                let last2 = categories[categories.length - 2];
                const endPort2 = last2.lastIndexOf('.');
                var last2tail = ''
                var last2front = ''
                if (endPort2 > -1) {
                    last2tail = last2.substring(endPort2 + 1);
                    last2front = last2.substring(0, endPort2);
                }
                if (last2tail == 'textbundle'){
                    categories.pop();
                }
            }

            var opt_AutoCategoryDepth = config.auto_category.depth || 3;
            var depth = opt_AutoCategoryDepth || categories.length - 2;
            if (categories.length - 2 == 0 || depth == 0) {
                tmpPost.categories = this.config.default_category;
            } else {
                var newCategories = categories.slice(1, 1 + Math.min(depth, categories.length - 2));
                //prevents duplicate file changes
                if (
                    !Array.isArray(tmpPost.categories) ||
                    tmpPost.categories.join('_') != newCategories.join('_')
                ) {
                    tmpPost.categories = newCategories;
                    log.i('Generated: categories [%s] for post [ %s ]', tmpPost.categories, data.full_source);
                }
            }
        }

        //add new generated link
        if (!abbrlink || abbrlink == '0' || config.force) {
            var opt_alg = this.config.abbrlink && this.config.abbrlink.alg ? this.config.abbrlink.alg : 'crc16';
            var opt_rep = this.config.abbrlink && this.config.abbrlink.rep ? this.config.abbrlink.rep : 'dec';
            let res = opt_alg == 'crc32' ? crc32.str(tmpPost.title + tmpPost.date) >>> 0 : crc16(tmpPost.title + tmpPost.date) >>> 0;
            //check this abbrlink is already exist then get a different one
            abbrlink = model.check(res);
            //set abbrlink to hex or dec
            abbrlink = opt_rep == 'hex' ? abbrlink.toString(16) : abbrlink;
            data.abbrlink = abbrlink;
            tmpPost.abbrlink = abbrlink;
            log.i('Generated: link [%s] for post [ %s ]', tmpPost.abbrlink, data.full_source);
        }
        let abbrlink_int = opt_rep == 'hex' ? parseInt('0x'+abbrlink) : abbrlink
        model.add(abbrlink_int);

        let postStr;
        if (!/.*\.org/.test(data.source)) {
            //process post
            postStr = front.stringify(tmpPost);
            postStr = '---\n' + postStr;
            fs.writeFileSync(data.full_source, postStr, 'utf-8');
        } else {
            postStr = data.raw.split('\n');
            postStr.splice(2, 0, '#+ABBRLINK: ' + abbrlink);
            fs.writeFileSync(data.full_source, postStr.join('\n'), 'utf-8');
        }

    }
    return data;
};

module.exports = logic;
