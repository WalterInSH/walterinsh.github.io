---
layout: blog
title: 我的编程习惯
---

2011年以前,我眼中的整洁代码仅仅是该缩进的地方缩进.自从读了[编写可读代码的艺术](http://www.amazon.cn/dp/B008B4DTG4)
这本书之后有了新的认识,里面介绍了如何写出优美可读的代码(不针对某种语言).里面印象比较深的大至有"方法拆分","见名知意",
"行内注释","代码风格","将自己想象成一个读者","先写注释再写代码"等思想.受益匪浅.

本文分享一些该书中没有的东西,仅仅是自己的体会.

---

### 不必要的判空  
2011年我入职一家公司,入职技术培训的是一个自以为很懂技术的副总,他给我们的开发标准中,特别强调了空指针
的问题,要判空. 可以看出"判空"这个注意点有多么的深入人心广为流传. 很久以前我总是抱着"判了总比没判好"
的思想, 到处判断一个返回值是否为null.  
其实,很多时候都没必要.而这些没必要的代码,就浪费了你读代码的时间,增加了复杂程度,同时我坚信"没用的代码也是bug"  
除了"一个标准的API,如果返回值是集合时,不应该是null",还有很多常见的API实际上也是不需要判空的

{% highlight java linenos%}
HttpSession session = request.getSession();

if(session == null){
  throw new RuntimeException("session not found");
}
{% endhighlight %}

从request中获取session的代码很常见,这里实际上是不需要判空的,以下是getSession的注释信息

>Returns the current session associated with this request, or if the request
does not have a session, creates one.

这里无意穷举所有这种情况,更多的多看看注释和源码就知道了.

### 传参  
当你初学编程,神坛上的谭浩强已经告诉你要给变量和方法起个合适的名字.但是他似乎没告诉你要传一个合适的参数进去.  
假设一个方法,目的是检查session中的用户信息,怎么起名字呢? 参数怎么办呢?  
checkOnlineUser似乎是个不错的名字,就这么定了.下面这个怎么样?

{% highlight java linenos%}
private void checkOnlineUser(HttpServletRequest request) {
  // Step one: Get user detail from request session
  // Step two: Check
}
{% endhighlight %}

我感觉不够好,因为方法名是checkOnlineUser,从名字上来看怎么都要有个User吧.(鱼香肉丝就没有鱼啊)  
虽然上面这个写法可以实现业务,但是总会给人一个参数和方法名无关的感觉.试着读下面的方法签名,是不是更顺口
一点

{% highlight java linenos%}
User onlineUser = getUserFromRequest(request);

checkOnlineUser(onlineUser);
...

private void checkOnlineUser(User onlineUser) {
  // The only step is checking user info
}
{% endhighlight %}

### equals断言的可读性  
断言中的equals断言,是有顺序的,testng中actual在前expected在后,junit相反.

{% highlight java linenos%}
// testng
static public void assertEquals(String actual, String expected);

// junit
static public void assertEquals(double expected, double actual);
{% endhighlight %}

有病的处女座,这两个有什么区别?体会以下如下过程

{% highlight groovy linenos%}
def a = stepOne();
def b = stepTwo(a);
def actual = a + b;

org.testng.Assert.assertEquals(actual, 4);
{% endhighlight %}

你是否是这两个思路中的一个:  
A.第一步得到a,再得到b,结果是a + b 叫做 actual,然后actual应该等于4.  
B.第一步得到a,再得到b,结果是a + b 叫做 actual,然后4应该等于actual.

你会发现第一种读起来更通顺,感觉更顺畅.没错,是感觉,没有科学依据.我问过很多人,也查了很多资料,发现很多
人对第二种思路感到别扭.

甚至还有一个框架为了测试可读性做了更多事情

{% highlight java linenos%}
assertThat("test", anyOf(is("test2"), containsString("te")));
{% endhighlight %}

###  用一个等宽,漂亮的字体  
你无法控制别人用什么字体看你的代码,但是你能控制你用什么字体看自己的代码. 试试等宽字体  

>A monospaced font, also called a fixed-pitch, fixed-width or non-proportional
font, is a font whose letters and characters each occupy the same amount of
horizontal space.This contrasts with variable-width fonts, where the letters
differ in size from one another, as do spacings in between many letters.

下面是两种等宽字体,你也可以下载更多的你喜欢的字体.  
[Source code pro](https://github.com/adobe/source-code-pro)  
[inconsolata](http://levien.com/type/myfonts/inconsolata.html)

如果你懒得下载安装一个喜欢的字体,至少从IDE提供的字体中选一个舒服的

---

一个好的编码习惯是做出来的,重构代码也是在重构自己的编码习惯.
