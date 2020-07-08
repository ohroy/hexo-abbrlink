# hexo-abbrlink
[![npm](https://img.shields.io/npm/dm/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dy/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dt/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)

A [Hexo plugin](https://hexo.io/plugins/) to generate static post link based on post titles.

## How to install

Add plugin to Hexo:

```
npm install hexo-abbrlink --save
```

Modify permalink in config.yml file:

```
permalink: posts/:abbrlink/
```

There are two settings:

```
alg -- Algorithm (currently support crc16 and crc32, which crc16 is default)
rep -- Represent (the generated link could be presented in hex or dec value)
```

```
# abbrlink config
abbrlink:
  alg: crc32      #support crc16(default) and crc32
  rep: hex        #support dec(default) and hex
  drafts: false   #(true)Process draft,(false)Do not process draft. false(default) 
  # Generate categories from directory-tree
  # depth: the max_depth of directory-tree you want to generate, should > 0
  auto_category:
     enable: true  #true(default)
     depth:        #3(default)
  auto_title: false #enable auto title, it can auto fill the title by path
  auto_date: false #enable auto date, it can auto fill the date by time today
  force: false #enable force mode,in this mode, the plugin will ignore the cache, and calc the abbrlink for every post even it already had abbrlink.
```

## Sample

The generated link will look like the following:

```
crc16 & hex
https://post.zz173.com/posts/66c8.html

crc16 & dec
https://post.zz173.com/posts/65535.html
```

```
crc32 & hex
https://post.zz173.com/posts/8ddf18fb.html

crc32 & dec
https://post.zz173.com/posts/1690090958.html
```

## Limitation
[fixed] Maximum number of posts is 65535 for crc16. (now, if a abbrlink already exist, it will change another one and try again and again...) 
## More info

see [this](https://post.zz173.com/detail/hexo-abbrlink.html)(Chinese)

## ThanksFor

[NoahDragon](https://github.com/NoahDragon)
