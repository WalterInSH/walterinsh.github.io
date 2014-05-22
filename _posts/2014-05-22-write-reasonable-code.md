---
layout: blog
title:
---

A  
```java
HttpSession session = request.getSession();

if(session == null){
  throw new RuntimeException("session not found");
}
```

>Returns the current session associated with this request, or if the request
does not have a session, creates one.

B  
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
等宽字体
