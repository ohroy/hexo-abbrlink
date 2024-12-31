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

let collected = false;
const DATA_DB = "db.json"
function collectExistingAbbrlinks (hexo) {
    if (collected)      // only collect existing abbrlinks once
        return;
    // iterate over all posts from DB
    collected = true;
    if (!fs.existsSync(DATA_DB))
        return;
    let last_data = fs.readFileSync(DATA_DB, { encoding: 'utf8' })
    last_data = JSON.parse(last_data)
    const posts = last_data['models']['Post']    
    posts.forEach(post => {
        model.recordExistingAbbrlink(post.abbrlink)     // mark this abbrlink as used
    });
}

let generateAbbrlink = function (data) {
    let log = this.log;
    const config = this.config.abbrlink || {};

    // draft processing
    let opt_drafts = config && config.drafts ? config.drafts : false;
    if (opt_drafts == false && data.source.startsWith('_drafts/')) {
        return data;
    }

    // ensure that each post should only be processed once
    if (model.isPostProcessed(data.source)) {
        let abbrlink = model.getGeneratedAbbrlink(data.source);
        if (abbrlink)
            data.abbrlink = abbrlink;
        return data;
    }

    // collect existing abbrlink in front-matters, to avoid conflict in later generation process
    // if config.force == true, no need to do this because all abbrlinks will be re-calculated
    if (!config.force)
        collectExistingAbbrlinks(this)

    // generate abbrlink for posts
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
            abbrlink_value = model.uniqueAbbrlink(abbrlink_value);
            // generate actual abbrlink string
            abbrlink = opt_rep == 'hex' ? abbrlink_value.toString(16) : abbrlink_value;
            data.abbrlink = abbrlink;

            model.cacheGeneratedAbbrlink(data.source, abbrlink)
            log.i('Generated: link [%s] for post [ %s ]', data.abbrlink, data.full_source);
        }
    }
    model.setPostProcessed(data.source)
    return data;
};

let writebackToFiles = function (data) {
    let opt_writeback = this.config.abbrlink && this.config.abbrlink.writeback != undefined ? this.config.abbrlink.writeback : true;
    if(!opt_writeback)
        return data;

    // avoid rewrite front-matter if the same abbrlink exists
    let abbrlink = model.getGeneratedAbbrlink(data.source)
    if(!abbrlink)
        return data;
    let front_matter = front.parse(data.raw);
    if (front_matter.abbrlink == abbrlink)
        return data;

    front_matter.abbrlink = abbrlink;
    if (!is_org_mode_file(data.source)) {
        // process post
        let postStr = front.stringify(front_matter);
        postStr = '---\n' + postStr;
        fs.writeFileSync(data.full_source, postStr, 'utf-8');
    } else {
        let postStr = data.raw.split('\n');
        postStr.splice(2, 0, '#+ABBRLINK: ' + abbrlink);
        fs.writeFileSync(data.full_source, postStr.join('\n'), 'utf-8');
    }
}

module.exports = {
    generateAbbrlink,
    writebackToFiles
};
