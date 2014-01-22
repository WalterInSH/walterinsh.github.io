---
layout: blog
title: Encoding problem with heritrix
---


最近，突发奇想，想把工作中遇到的问题和大家分享出来。自己没有牛到贡献一个开源项目，但是，有多少就贡献多少吧。
废话不多说。第一次分享的是Heritrix的乱码解决。
根据官方文档或者是一些blog，可以很轻松的配出一个可以运行的heritrix，基于web的管理页面也十分简单。但是中文乱码问题却很少有提及，就算提及，也是一句话，和没说一样。
目前Google、Baidu上能搜到的，大多是Heritrix 1.X的内容，heritrix 3.x的比较少，而这两个版本的结构貌似差的挺大，所以在Heritrix3上遇到的很多问题就得靠自己了。
 
heritrx 3 首先会去根据服务器返回的Content-type去获得编码。

在此我真的想感叹，老外的世界里只有ISO-8859-1吗！
这个时候我们可以根据HTML的meta信息来判断，例如
 
<metahttp-equiv="content-type"content="text/html;charset=utf-8">
 
 我目前还没见过从这个地方获得不到编码的（也有可能是我阅历浅），所以从这个地方拿编码还是比较靠谱的，拿的方法有很多种，我当时借鉴了Jsoup用了正则来获得。至于这段代码，也不在手边，有机会再贴吧，目前仅提供一个思路吧。
也许解决乱码问题还有更好的办法，欢迎留言。