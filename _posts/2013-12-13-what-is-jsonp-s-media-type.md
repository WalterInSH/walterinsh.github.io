---
layout: post
title: Json-p 的meida type到底是什么
date:   2013-12-13
---

JSON-P是跨域访问常用的框架，jQuery支持，我们的项目中大量使用这种方式开发。
其返回类似
{% highlight javascript %}
jQuery110200643796210642904_1386842752478({"field":value})
{% endhighlight %}

这种结构。括号中间的是我们接口返回的数据，JSON结构。

那么jsonp的media type到底是json还是javascript呢？长的好像json

>官方文档中:  
>The most critical piece of this proposal is that browser vendors must begin to enforce this rule for script tags that are receiving JSON-P content, and throw errors (or at least stop processing) on any non-conforming JSON-P content.
In order for the browser to be able to know when it should apply such content-filtering to what might otherwise be seen as regular JavaScript content, the MIME-type "application/json-p" and/or "text/json-p" must be declared on the requesting &lt;script&gt; element. Furthermore, the browser can enforce that the response must be of the matching MIME-type, or fail with errors as well.

文档指定了两种type，希望浏览器厂商支持，但是这两种都未被IANA承认，至少目前没有，所以浏览器短时间不会正式支持吧。

从json-p原理来看，其会将返回的内容当作一个函数执行，所以严格来说它更是一段javascript。从github的多个项目中可以看出普遍是这么对待的，例如这个<br/>
https://github.com/bhagyas/spring-jsonp-support/blob/master/src/main/java/com/intera/util/web/servlet/filter/JsonpCallbackFilter.java

注：
IANA规定的media types<br/>
http://www.iana.org/assignments/media-types/media-types.xhtml

jsonp官网<br/>
http://json-p.org/
