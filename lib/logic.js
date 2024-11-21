'use strict';

let crc16 = require('./crc16');
let crc32 = require('./crc32');
let model = require('./model');
let front = require('hexo-front-matter');
let fs = require('hexo-fs');

function is_org_mode_file(filepath) {
    return /.*\.org/.test(filepath)
}

function org_get_abbrlink(data) {
    let r = data.content.match(/#\+ABBRLINK:.*\n/);
    if (r) {
        data.abbrlink = r[0].split(':')[1].trim();
    } else {
        data.abbrlink = '';
    }
    return data;
}

let generateAbbrlink = function (data) {
    let log = this.log;
    const config = this.config.abbrlink || {};

    // Draft processing
    let opt_drafts = config && config.drafts ? config.drafts : false;
    if (opt_drafts == false && data.source.startsWith('_drafts/')) {
            return data;
    }
    // only calc for posts
    if (data.layout == 'post') {
        let abbrlink;
        if (!is_org_mode_file(data.source)) {
            abbrlink = data.abbrlink;
        } else {
            abbrlink = org_get_abbrlink(data).abbrlink;
        }

        // re-parse front matter
        let front_matter = front.parse(data.raw);

        // calc abbrlinks
        if (!abbrlink || abbrlink == '0' || config.force) {
            let opt_alg = config && config.alg ? config.alg : 'crc16';
            let opt_rep = config && config.rep ? config.rep : 'dec';
            let abbrlink_value = opt_alg == 'crc32' ? crc32.str(front_matter.title + front_matter.date) >>> 0 : crc16(front_matter.title + front_matter.date) >>> 0;
            // if this abbrlink already exists, choose a different one
            abbrlink_value = model.check(abbrlink_value);
            model.add(abbrlink_value);
            // generate actual abbrlink string
            abbrlink = opt_rep == 'hex' ? abbrlink_value.toString(16) : abbrlink_value;
            data.abbrlink = abbrlink;
            front_matter.abbrlink = abbrlink;
            log.i('Generated: link [%s] for post [ %s ]', front_matter.abbrlink, data.full_source);
        }

        let postStr;
        if (!is_org_mode_file(data.source)) {
            // process post
            postStr = front.stringify(front_matter);
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

module.exports = generateAbbrlink;
