---
layout: blog
title: Java & PHP session 共享
---

###Backgroud  
唯品会B2C等多个项目都采用PHP开发,而我们用户团队后端是Java为主的团队,有时我们需要和PHP应用共享session. 此时session序列化和反序列化是一个必须面对的问题.

###PHP的序列化  
PHP支持多种序列化协议,json是其中对多语言支持最好的,所以采用JSON格式共享session是个选择.我们这里介绍另一种途径:Java兼容PHP自身的序列化协议.  
PHP序列化和反序列化使用 serialize()&unserialize() 接口

{% highlight php%}
<?php
session_start();
$_SESSION['userId']=1;
$_SESSION['username']="xiaohuang";
$_SESSION['countryId']="CH";
$_SESSION['userId']=1;
echo serialize($_SESSION);
echo "<br/>";
echo "session is an ";
echo gettype($_SESSION);
?>

// a:3:{s:6:"userId";i:1;s:8:"username";s:9:"xiaohuang";s:9:"countryId";s:2:"CH";}
// session is an array
{% endhighlight %}

session在Java中可以被看作 Map<String,Object>,在PHP中被看作array.

###Java兼容PHP序列化  
由于PHP本身序列化不是二进制的,所以Java兼容PHP,可以看作获取session string之后做文本的解析. 为了不重复造轮子,这里使用一个开源框架pherialize(https://github.com/kayahr/pherialize).
使用列子

{% highlight java%}
public String saveUserInSession(User user) {
        MixedArray session = new MixedArray();
        session.put(USER_ID_KEY, user.getUserId());
        session.put(USER_NAME_KEY, user.getUsername());
        session.put(USER_GENDER_KEY, user.getGender().name());

        String sessionVal = Pherialize.serialize(session);
        String sessionId = sessionIdGenerator.generateSessionId();

        memcachedClient.set(sessionId, THREE_HOURS, sessionVal);
        return sessionId;
}

public User getUserFromSession(String sessionId){
    String sessionVal = (String) sessionObject;
    MixedArray mixedArray = Pherialize.unserialize(sessionVal).toArray();
    int userId = mixedArray.getInt(USER_ID_KEY);
    String username = mixedArray.getString(USER_NAME_KEY);
    String userGender = mixedArray.getString(USER_GENDER_KEY);

    User user = new User();
    user.setUserId(userId);
    user.setUsername(username);
    user.setGender(UserGender.valueOf(userGender));
    return user;
}
{% endhighlight %}

使用起来还是十分简便的,但是需要注意的是支持的类型有限. 关于支持的类型列表,请参照[这里](https://github.com/kayahr/pherialize/blob/master/README.md#description)
