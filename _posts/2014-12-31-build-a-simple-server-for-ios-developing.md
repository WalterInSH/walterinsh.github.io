---
layout: blog
title: 为iOS开发搭建一个简单Server
---

往往,我们开发的App不是一个完全独立的程序,需要访问后端服务器交换数据.例如登录注册这种简单的请求.

问题来了,我们如果真的用Java或者nodejs搭一个后台服务,我们将陷入同时用两种语言开发两个应用的处境,我们需要
不停的在后台服务的开发和App的开发之间切换思路,导致我们不能将注意力集中在App的开发上.解决方案如下.

方案A  
跳过需要访问后端的代码,写个TODO.

方案B  
有时候你需要一些数据,不能跳过去,那可以像下面这样写死

{% highlight Objective-C %}
NSString *respData = @"[{\"dataId\":1,\"dataContent\":\"Happy New Year\"}]";
NSArray *dataArray = [respData objectFromJSONString];
{% endhighlight %}

然后等以后把写死的改为调用后端接口.

方案C  
前面的方案快捷省事,但是有时也不足.管理你写死的数据就成了一个成本,如果你每个地方编的假数据互相冲突,
可能会造成程序错误,或者页面展现不符合逻辑.  
所以我的办法是使用[json-server](https://github.com/typicode/json-server),写一个类似这样的文件

{% highlight JavaScript %}
//db.json
{
  "users": [
    {
      "userId": 1,
      "name": "Tim Cook"
    },
    {
      "userId": 2,
      "name": "Jim Walker"
    }
  ]
}
{% endhighlight %}

然后执行"json-server db.json",访问http://localhost:3000/users,你会看到你的user数据.  
可以用这个文件做一个简单的数据库,也许十几条数据,并提供一个访问这些数据的url,供App调用.你甚至可以加
参数http://localhost:3000/users?userId=1.

方案C提供了一个简单真实的后端Server,同时不需要真的花太多时间去搭后端环境,编的假数据也可以被组织起来.
当你真的准备开发后端的时候,按照数据格式,一心搭一个后端服务.而在这之前,一心写App.

方案C相较方案B,还有一个小优点,可以让代码规整一点,那些写死的假数据NSString,往往很长,让代码变得不整洁.
