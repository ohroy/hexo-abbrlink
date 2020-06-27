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
    }
    else
    {
        data.abbrlink = ''
    }
        return data
}

let logic = function(data) {
    var log = this.log;
    //+++ Draft processing	
	if (this.config.abbrlink.drafts == false){
		if (!this.config.render_drafts && data.full_source.indexOf("_drafts")>0)
        return data;
	}
	//+++
	if (data.layout == 'post') {
        let abbrlink
        if (!/.*\.org/.test(data.source)){
            abbrlink = data.abbrlink
        }
        else
        {
            abbrlink = org_get_abbrlink(data).abbrlink
        }
        if (!abbrlink) {
			var opt_alg = ((this.config.abbrlink && this.config.abbrlink.alg) ? this.config.abbrlink.alg : 'crc16');
			var opt_rep = ((this.config.abbrlink && this.config.abbrlink.rep) ? this.config.abbrlink.rep : 'dec')
			
			let res = (opt_alg == 'crc32' ? crc32.str(data.title) >>> 0 : crc16(data.title) >>> 0);
			//check this abbrlink is already exist then get a different one
			abbrlink = model.check(res);
			//set abbrlink to hex or dec
			abbrlink = opt_rep == 'hex' ? abbrlink.toString(16) : abbrlink;
            data.abbrlink = abbrlink;
            let postStr;
            if (!/.*\.org/.test(data.source)){
				//re parse front matter
				var tmpPost = front.parse(data.raw);
				//add new generated link
				tmpPost.abbrlink = abbrlink;
				//+++ 
				//From: hexo-auto-category
				//see:https://github.com/xu-song/hexo-auto-category
				//File: hexo-auto-category\lib\logic.js
				var overwrite = true;			
				if (this.config.abbrlink.auto_category.enable && overwrite) {
					var categories = data.slug.split('/');
					var depth = this.config.abbrlink.auto_category.depth || categories.length-1;
					if (categories.length-1 == 0){
						tmpPost.categories =  this.config.default_category;
					}else{
						tmpPost.categories = categories.slice(0, Math.min(depth, categories.length-1));
					}
				} 			
				//+++
				//process post
                postStr = front.stringify(tmpPost);
				postStr = '---\n' + postStr;
				fs.writeFileSync(data.full_source, postStr, 'utf-8');
            }
            else
            {
                postStr = data.raw.split("\n")
                postStr.splice(2,0,'#+ABBRLINK: ' + abbrlink)
                fs.writeFileSync(data.full_source, postStr.join('\n'), 'utf-8');
            }
            if(data.title.length==0)
                log.i("No title found for post [%s]", data.slug);
				log.i("Generate link %s for post [%s]", abbrlink, data.title);
				//+++
				//From: hexo-auto-category
				//see:https://github.com/xu-song/hexo-auto-category
				//File: hexo-auto-category\lib\logic.js
				log.i("Generated: categories [%s] for post [%s]", tmpPost.categories, data.title);
				//+++
        }
        model.add(abbrlink);
    }
    return data
}



module.exports = logic;
