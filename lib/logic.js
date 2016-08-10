'use strict';

var crc = require('./crc16');
var model = require('./model');
var front = require('hexo-front-matter');
var fs = require('hexo-fs');

let checKCrc = function(res) {
    if (crcRes.indexOf(res) > -1) {
        res++;
        return checKCrc(res);
    } else {
        return res;
    }

}

let logic = function(data) {
    var log = this.log;
    if (data.layout == 'post') {
        let abbrlink = data.abbrlink
        if (!abbrlink) {
            let res = crc(data.title) >>> 0;
            abbrlink = model.check(res);
            console.log("sfasdfasdf:", abbrlink);
            data.abbrlink = abbrlink;
            //重新解析font matter
            var tmpPost = front.parse(data.raw);
            //添加我们生成的链接
            tmpPost.abbrlink = abbrlink;
            //生成处理后的文章
            let postStr = front.stringify(tmpPost);
            postStr = '---\n' + postStr;
            fs.writeFileSync(data.full_source, postStr, 'utf-8');
            log.i("已为%s生成连接%s", data.title, abbrlink);
        }
        model.add(abbrlink);
    }
}



module.exports = logic;
