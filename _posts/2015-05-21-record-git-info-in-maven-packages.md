---
layout: post
title: Maven打包时加入Git信息
date:   2015-05-21
---

我们在开发中遇到了一个问题，有时无法确定一个jar或者war在被打出来的时候是在哪个分支上，当时的commit id是什么。
知道这个id可以让我们知道包的新旧(对于git历史)，也可以知道有些功能是否被包含在这个包中。如果在这个包运行时也可以获取这些信息，那么可以给在线调试、bug定位带来更多便利。

在github上有一个现成的maven插件实现了这件事，打包的时候将git的信息写入一个文件。（我们可以想办法把这些信息进一步暴露出来）

这些信息大致包含：

* commit id
* 最后提交时间、内容、人、邮箱
* 打包人和时间

### 如何安装

在maven配置文件中加入

{% highlight xml %}
<plugin>
    <groupId>pl.project13.maven</groupId>
    <artifactId>git-commit-id-plugin</artifactId>
    <version>2.1.13</version>
    <executions>
        <execution>
            <goals>
                <goal>revision</goal>
            </goals>
        </execution>
    </executions>

    <configuration>
        <dateFormat>yyyy.MM.dd HH:mm:ss</dateFormat>
        <verbose>true</verbose>
        <generateGitPropertiesFile>true</generateGitPropertiesFile>
        <gitDescribe>
            <always>false</always>
            <dirty>-dirty</dirty>
            <forceLongFormat>false</forceLongFormat>
        </gitDescribe>
    </configuration>
</plugin>
{% endhighlight %}

[Github 地址](https://github.com/ktoso/maven-git-commit-id-plugin)

官方readme中包含完整配置和解释，我这里使用的是删减版，也是我们项目中使用的。

我们在项目启动的时候会去Load信息文件，通过固定url接口暴露出来。
