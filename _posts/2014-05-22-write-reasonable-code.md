---
layout: blog
title:
---

A 不必要的判空  
2011年我入职一家公司,入职技术培训的是一个自以为很懂技术的副总,他给我们的开发标准中,特别强调了空指针
的问题,要判空. 可以看出"判空"这个注意点有多么的深入人心广为流传. 很久以前我总是抱着"判了总比没判好"
的思想, 到处判断一个返回值是否为null.  
其实,很多时候都没必要.而这些没必要的代码,就浪费了你读代码的时间,增加了复杂程度,同时我坚信"没用的代码
也是bug"  
除了"一个标准的API如果返回值是集合时,不应该是null",还有很多常见的API实际上也是不需要判空的  
```java
HttpSession session = request.getSession();

if(session == null){
  throw new RuntimeException("session not found");
}
```  
从request中获取session的代码很常见,这里实际上是不需要判空的,以下是getSession的注释信息

>Returns the current session associated with this request, or if the request
does not have a session, creates one.

这里无意穷举所有这种情况,更多的多看看注释和源码就知道了.

B 当你初学编程,神坛上的谭浩强已经告诉你要给变量起一个见名知意的名字,也许还要给方法起个合适的名字.但是
他似乎没告诉你要传一个合适的参数进去.  
假设一个方法,目的是将用户不敏感信息放在cookie中,怎么起名字呢? 参数怎么办呢?  
addUserCookie似乎是个不错的名字,就这么定了.参数呢?
```java
private void addUserCookie(HttpServletRequest request,
                            HttpServletResponse response) {
  // Step one: Get user detail from request session
  // Step two: Create user detail cookie & put it into response
}
```

```java
User user = getUserFromSession(request.getSession());

private void addUserCookie(User user, HttpServletResponse response) {
  // The only step is creating user detail cookie & put it into response
}
```

C  
```java
// testng
static public void assertEquals(String actual, String expected);

// junit
static public void assertEquals(double expected, double actual);
```

D  
```java
public void method(Integer paramOne,String paramTwo){
  if(paramOne == null){
    throw new IllegalArgumentException();
  }
  if(paramTwo == null || paramTwo.isEmpty()){
    throw new IllegalArgumentException();
  }

  ...
}
```

```java
public void method(Integer paramOne,String paramTwo){
  Preconditions.checkArgument(paramOne != null);
  Preconditions.checkArgument(paramTwo != null && !paramTwo.isEmpty());

  // apache commons framework is shorter
  // Preconditions.checkArgument(StringUtils.isNotBlank(paramTwo));

  ...
}
```

Hibernate validator  
```java
public void method(@NotNull Integer paramOne,
                    @NotBlank String paramTwo){

  ...
}
```

E  
>A monospaced font, also called a fixed-pitch, fixed-width or non-proportional
font, is a font whose letters and characters each occupy the same amount of
horizontal space.This contrasts with variable-width fonts, where the letters
differ in size from one another, as do spacings in between many letters.

[Source code pro](https://github.com/adobe/source-code-pro)
