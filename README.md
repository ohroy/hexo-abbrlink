# hexo-abbrlink
[![npm](https://img.shields.io/npm/dm/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dy/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dt/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)

A [Hexo plugin](https://hexo.io/plugins/) to generate static post link based on post titles.
## Suggest
[https://github.com/rozbo/hexo-abbrlink2](https://github.com/rozbo/hexo-abbrlink2), supports the orderly growth of ID is beta now.
The working principle of `hexo-abbrlink2` is different from this plug-in, not as an upgraded version of this plugin, they are different individuals.
But `hexo-abbrlink2` is compatible with the previous configuration of this plugin.
As a supplement to this plugin, use it only when you really need an orderly growing id.
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

```yml
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
     over_write: false 
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


## Sponsor
The project is develop by [JetBrains Ide](https://www.jetbrains.com/?from=puck)

[![](https://www.jetbrains.com/company/brand/img/logo1.svg)](https://www.jetbrains.com/?from=puck)
