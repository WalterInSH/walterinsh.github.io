---
layout: post
title: 我的编程习惯
date:   2014-05-22
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
其实,很多时候都没必要.而这些没必要的代码,就浪费了你读代码的时间,增加了复杂程度,同时我坚信"没用的代码也是bug".  
除了"一个标准的API,如果返回值是集合时,不应该是null",还有很多常见的API实际上也是不需要判空的

{% highlight java %}
HttpSession session = request.getSession();

if(session == null){
  throw new RuntimeException("session not found");
}
{% endhighlight %}

从request中获取session的代码很常见,这里实际上是不需要判空的,以下是getSession的注释信息

>Returns the current session associated with this request, or if the request
does not have a session, creates one.

我曾见过一个实习生在为一名高级工程师做完code review后指出有段代码是没有用的,却被反问“它报错了吗？
没报错不就完了”.  
往往,我们纵容那些没有用的代码,仅仅是因为它不会报错.  

### 传参  
当你初学编程,神坛上的谭浩强已经告诉你要给变量和方法起个合适的名字.但是他似乎没告诉你要传一个合适的参数进去.  
假设一个方法,目的是检查session中的用户信息,怎么起名字呢? 参数怎么办呢?  
checkOnlineUser似乎是个不错的名字,就这么定了.下面这个怎么样?

{% highlight java %}
private void checkOnlineUser(HttpServletRequest request) {
  // Step one: Get user detail from request session
  // Step two: Check
}
{% endhighlight %}

我感觉不够好,因为方法名是checkOnlineUser,从名字上来看怎么都要有个User吧.(鱼香肉丝就没有鱼啊)  
虽然上面这个写法可以实现业务,但是总会给人一个参数和方法名无关的感觉.试着读下面的方法签名,是不是更顺口
一点

{% highlight java %}
User onlineUser = getUserFromRequest(request);

checkOnlineUser(onlineUser);
...

private void checkOnlineUser(User onlineUser) {
  // The only step is checking user info
}
{% endhighlight %}

### equals断言的可读性  
断言中的equals断言,是有顺序的,testng中actual在前expected在后,junit相反.

{% highlight java %}
// testng
static public void assertEquals(String actual, String expected);

// junit
static public void assertEquals(double expected, double actual);
{% endhighlight %}

有病的处女座,这两个有什么区别?体会以下如下过程

{% highlight groovy %}
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

{% highlight java %}
assertThat("test", anyOf(is("test2"), containsString("te")));
{% endhighlight %}

### 可读性和行数的平衡  
首先一个方法的行数最好能在一屏内,但是这并不意味着要最大限度的减少行数,有时增加几行会让代码更好读

{% highlight java %}
ConnectionPool connPool = ConnectionPool.newInstance(30,400,true,false);
{% endhighlight %}

假设我们要获得一个连接池的实例,这么写已经足够了,而且行数还特别少.但是当你回头读这行代码的时候,特别是当你出现bug回头复查的时候,
这行可能因为可读性差而隐藏了bug.例如在上面的代码中,code reviewer 无法第一眼看出你是否使用了默认驱动,它们要更仔细的去阅读.

如果你不看newInstance的的JavaDoc,你肯定无法得知那四个参数都是什么意思.但是当你使用成员变量或者本地变量声明它们,
别人就更好理解你是怎么初始化它的,是不是真的正确的初始化它们的.也许你已经这么干了只是你没感觉到.

{% highlight java %}
//local variable or class field
int minConn = 30;
int maxConn = 400;
boolean useDefaultDriver = true;
boolean longConn = false;

ConnectionPool connPool = ConnectionPool.newInstance(minConn,maxConn,useDefaultDriver,longConn);
{% endhighlight %}

在编写可读代码的艺术一书中,作者提到了一种写法(如下),我感觉适合参数较少的时候,或者你想对其中某一个特别标注的时候,当参数多的时候也不如声明几个变量.

{% highlight java %}
ConnectionPool connPool = ConnectionPool.newInstance(/*minConn=*/30,
                                                /*maxConn=*/400,
                                                /*useDefaultDriver=*/true,
                                                /*longConn=*/false);
{% endhighlight %}

Less code more feature并不是说行数少,代码多几行并不意味着读上去更耗时间,将关键信息简写可能会隐藏bug.

---

一个好的编码习惯是做出来的,重构代码也是在重构自己的编码习惯.
