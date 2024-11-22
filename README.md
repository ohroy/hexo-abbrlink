# hexo-abbrlink
[![npm](https://img.shields.io/npm/dm/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dy/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)
[![npm](https://img.shields.io/npm/dt/hexo-abbrlink.svg)](https://www.npmjs.com/package/hexo-abbrlink)

A [Hexo plugin](https://hexo.io/plugins/) to generate static post link based on title and data in the post front.

This plugin supports `.textbundle` -- a file format contents markdown and its assets. Actually, `.textbundle` file is a folder which shows like a file in Finder on macOS.

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
# or
permalink: posts/:abbrlink.html
```

Configs in `_config.yml`:

```
# abbrlink config
abbrlink:
  alg: crc32      # Algorithm used to calc abbrlink. Support crc16(default) and crc32
  rep: hex        # Representation of abbrlink in URLs. Support dec(default) and hex
  drafts: false   # Whether to generate abbrlink for drafts. (false in default)
  force: false    # Enable force mode. In this mode, the plugin will ignore the cache, and calc the abbrlink for every post even it already had an abbrlink. (false in default)
  writeback: true # Whether to write changes to front-matters back to the actual markdown files. (true in default)
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

## More info

see [this](https://post.zz173.com/detail/hexo-abbrlink.html)(Chinese)

## ThanksFor

[NoahDragon](https://github.com/NoahDragon)


## Sponsor
The project is develop by [JetBrains Ide](https://www.jetbrains.com/?from=puck)

[![](https://www.jetbrains.com/company/brand/img/logo1.svg)](https://www.jetbrains.com/?from=puck)
