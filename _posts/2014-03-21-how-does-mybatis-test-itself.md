---
layout: post
title: MyBatis 团队是如何写单元测试的
date:   2014-03-21
---

#引言
MyBatis是一个Java持久层框架,但是和Hibernate不一样,因为

>MyBatis does not map Java objects to database tables but Java methods to SQL statements.

写出这个流行框架的团队,是如何做单元测试的呢?

---
#构建测试环境
既然是一个持久层框架,那么测试自然离不开数据库,采用真实的MySQL或者类似的数据库是一个选择,但是有诸多不足

1. 运行测试需要安装真实的数据库,很麻烦

2. 数据库中可能有历史数据,对单元测试可能产生影响

3. 对于一个开源项目,out of the box是一个非常友好的特性. 单元测试作为项目的一部分,方便的跑起来,对使用者的积极性是个促进.

<br/>

所以采用一种内存数据库就是上佳的选择, MyBatis采用的是[apache derby](http://db.apache.org/derby/). (虽然在源码中有hsqldb,但是测试代码中并未使用hsqldb.)

构建这个数据库环境基本就是读DDL & script 文件,一行一行的写进数据库,大致分为三步:

* 清空现有环境(eg. databases/blog/blog-derby-schema.sql)

{% highlight MySQL %}
...
DROP TABLE comment;
...
DROP PROCEDURE selectTwoSetsOfAuthors;
...
{% endhighlight %}

* 载入schema

{% highlight MySQL %}
CREATE TABLE author (
id NT NOT NULL GENERATED BY DEFAULT AS IDENTITY (START WITH 10000),
...
);
{% endhighlight %}

* 插入测试数据 (eg. databases/blog/blog-derby-dataload.sql)

{% highlight MySQL %}
INSERT INTO author (id,username, password, email, bio, favourite_section)
          VALUES (101,'jim','********','jim@ibatis.apache.org','','NEWS');
{% endhighlight %}

MyBatis的 org.apache.ibatis.BaseDataTest 提供这个环境的载入(eg. BaseExecutorTest)

{% highlight java %}
public class BaseExecutorTest extends BaseDataTest {
  protected final Configuration config;
  protected static DataSource ds;

  @BeforeClass
  public static void setup() throws Exception {
    ds = createBlogDataSource();
  }

  public BaseExecutorTest() {
    config = new Configuration();
    config.setLazyLoadingEnabled(true);
    config.setUseGeneratedKeys(false);
    config.setMultipleResultSetsEnabled(true);
    config.setUseColumnLabel(true);
    config.setDefaultStatementTimeout(5000);
  }
}
{% endhighlight %}

#测试
MyBatis采用了[junit](http://junit.org/) & [mockito](https://github.com/mockito/mockito),测试的写法并没有什么区别,但是有些习惯却值得学习

* 为bug或者issue 写单元测试,并且写明这个问题是什么,eg:

{% highlight java %}
  //Issue 4: column is mandatory on nested queries
  @Test(expected=IllegalStateException.class)
  public void shouldFailWithAMissingColumnInNetstedSelect() throws Exception {
    new ResultMapping.Builder(configuration, "prop")
    .nestedQueryId("nested query ID")
    .build();
  }
{% endhighlight %}

* 团队编写单元测试遵从统一编程风格,尽量遵从[BDD](http://en.wikipedia.org/wiki/Behavior-driven_development)


<br/>
<br/>
<br/>
<br/>

---
For further info:

http://lightjavadatabase.blogspot.com/2012/12/choosing-light-weight-java-database.html

http://www.ibm.com/developerworks/cn/java/j-cq09187/
