---
layout: blog
title: Maven 编译后 二进制文件乱码
---

背景：一个Maven项目，在resource下有一个数据文件(.dat)，程序中需要读取这个文件。在编译后，读取失败，md5验证后发现文件变了，出现了乱码。
 
原因：Maven对resource下文件做渲染改变了这个二进制文件的编码。
 
处理方法：使用Binaries filtering 

```
<project>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-resources-plugin</artifactId>
        <version>2.6</version>
        <configuration>
          <nonFilteredFileExtensions>
            <nonFilteredFileExtension>dat</nonFilteredFileExtension>
            <nonFilteredFileExtension>swf</nonFilteredFileExtension>
          </nonFilteredFileExtensions>
        </configuration>
      </plugin>
    </plugins>
  </build>
</project>
```

可以避免指定文件不被渲染。
 
另有一个类似的解决方法，未亲测

[http://maven.apache.org/plugins/maven-resources-plugin/examples/filter.html](http://maven.apache.org/plugins/maven-resources-plugin/examples/filter.html)