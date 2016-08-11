# hexo-abbrlink

A [Hexo plugin](https://hexo.io/plugins/) to generate static post link based on post title and time.

## How to install

Add plugin to Hexo:

``` 
npm install hexo-abbrlink --save
```

Modify permalink in config.yml file:

```
permalink: posts/:abbrlink/
```

## Sample

The generated link will look like the following:
```
https://post.zz173.com/posts/65535.html
```

## Limitation

Maximum number of posts is 65535. (For a personal blog site, this number is decent)

## More info 

see [this](https://post.zz173.com/detail/hexo-abbrlink.html)(Chinese)
