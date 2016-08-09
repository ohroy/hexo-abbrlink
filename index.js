'use strict';

var hexo = hexo || {};

var log = hexo.log;
var crc = require('crc-32');
var front=	require('hexo-front-matter');
var fs   = require('hexo-fs');


hexo.extend.filter.register('before_post_render', function (data) {
	if(!data.abbrlink&& data.layout=='post'){
		let res= crc.str(data.title)>>>0;
		let abbrlink=res.toString(16);
		data.abbrlink=abbrlink;
		//重新解析font matter
		var tmpPost=front.parse(data.raw);
		//添加我们生成的链接
		tmpPost.abbrlink=abbrlink;
		//生成处理后的文章
		let postStr=front.stringify(tmpPost);
		postStr='---\n'+postStr;
		fs.writeFileSync(data.full_source,postStr,'utf-8');
		log.i("已为%s生成连接%s",data.title,abbrlink);
	}
	
});
