---
layout: post
title: Maven打包时加入Git信息
date:   2015-05-21
---


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

