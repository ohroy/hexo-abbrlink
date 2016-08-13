# hexo-abbrlink

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
  alg: crc32  #support crc16(default) and crc32
  rep: hex    #support dec(default) and hex
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

Maximum number of posts is 65535 for crc16. (For a personal blog site, this number is decent)

## More info

see [this](https://post.zz173.com/detail/hexo-abbrlink.html)(Chinese)

## ThanksFor

[NoahDragon](https://github.com/NoahDragon)
