'use strict';

var hexo = hexo || {};

var log = hexo.log;
var crypto = require('crypto');
var front=	require('hexo-front-matter');
var fs   = require('hexo-fs');


hexo.extend.filter.register('before_post_render', function (data) {
	if(!data.abbrlink&& data.layout=='post'){
		var abbrlink=crypto.createHash('md5')
		.update(data.title,'utf-8')
		.update(Date(),'utf-8')
		.digest('base64')
		.replace(/\+/g,'-')
		.replace(/\//g,'_')
		.replace(/\=\=/g,'');
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
