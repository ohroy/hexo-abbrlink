'use strict';

var crc16 = require('./crc16');
var crc32 = require('./crc32');
var model = require('./model');
var front = require('hexo-front-matter');
var fs = require('hexo-fs');

let logic = function(data) {
    var log = this.log;
    if (data.layout == 'post') {
        let abbrlink = data.abbrlink
        if (!abbrlink) {
			var opt_alg = ((this.config.abbrlink && this.config.abbrlink.alg) ? this.config.abbrlink.alg : 'crc16');
			var opt_rep = ((this.config.abbrlink && this.config.abbrlink.rep) ? this.config.abbrlink.rep : 'dec')
			
			let res = (opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0);
			//check this abbrlink is already exist then get a different one
			abbrlink = model.check(res);
			//set abbrlink to hex or dec
			abbrlink = opt_rep == 'hex' ? abbrlink.toString(16) : abbrlink;
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
