'use strict';

var crc = require('./crc16');
var model = require('./model');
var front = require('hexo-front-matter');
var fs = require('hexo-fs');

let logic = function(data) {
    var log = this.log;
    if (data.layout == 'post') {
        let abbrlink = data.abbrlink
        if (!abbrlink) {
            let res = crc(data.title) >>> 0;
            abbrlink = model.check(res);
            data.abbrlink = abbrlink;
            //re parse front matter
            var tmpPost = front.parse(data.raw);
            //add new generated link
            tmpPost.abbrlink = abbrlink;
            //process post
            let postStr = front.stringify(tmpPost);
            postStr = '---\n' + postStr;
            fs.writeFileSync(data.full_source, postStr, 'utf-8');
            log.i("Generate link %s for post [%s]", abbrlink, data.title);
        }
        model.add(abbrlink);
    }
}



module.exports = logic;
