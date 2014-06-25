---
layout: blog
title: 如何在前后端开发分离时做grunt & maven集成
---

##背景  
在唯品会用户中心团队中,前后端开发界限很清晰,分离很彻底.我们甚至会将一个项目,分为两个git repository.分别开发然后打包的时候一起发布.(这里不解释这么做的好处)  
但是这个流程中,我们需要将前端项目grunt产生的静态文件人肉复制到我们的java web项目中,这个过程就会问题:  
1.有人工时间成本  
2.因为人的参与变的可能出错  
3.不是自动化  

基于以上背景,我提出了如下方案,解决前后端不同git repository时grunt和maven的集成问题

###解决方案基础  
A.后端项目基于maven  
B.前端项目基于grunt构建后,将产物输出到固定的文件夹中  
C.前后端项目都采用git做版本控制,且git版本不小于1.8.2  
D.开发\CI环境安装nodejs  

##原理  
A.git submodule可以方便在一个git项目中引入另一个git项目,两者相对独立,各自的版本控制互不影响.这样就可以保证这个方案对前端工程师是透明的,对后端工程师而言就像一个普通的目录.  
B.git submodule保留前后端项目不同git分支的对应关系(git version > 1.8.2)

##搭建步骤  
A. 后端项目使用git submodule引入前端项目

{% highlight Bash shell scripts linenos%}
git submodule add -b front-end-branch http://front-end-project-url   src/main/webapp/front-end
{% endhighlight %}

这时,前端项目就被引入到了后端项目中,可以看作后端项目的一个文件夹

B. maven pom.xml中增加[grunt-maven-plugin](https://github.com/allegro/grunt-maven-plugin)

{% highlight xml linenos%}
<!-- grunt maven plugin负责安装grunt项目和执行grunt命令-->
<plugin>
    <groupId>pl.allegro</groupId>
    <artifactId>grunt-maven-plugin</artifactId>
    <version>1.3.2</version>
    <configuration>
        <gruntBuildDirectory>
            ${basedir}/src/main/webapp/front-end
        </gruntBuildDirectory>
        <gruntExecutable>
            node_modules/grunt-cli/bin/grunt
        </gruntExecutable>
        <runGruntWithNode>
            true
        </runGruntWithNode>
        <gruntOptions>
            <gruntOption>
                --verbose
            </gruntOption>
        </gruntOptions>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>npm</goal>
                <goal>grunt</goal>
            </goals>
        </execution>
    </executions>
</plugin>
{% endhighlight %}

C. 在maven打包的时候过滤掉grunt的文件,安装maven war plugin

{% highlight xml linenos%}
<!-- war plugin将引入的grunt源码和前端项目配置环境等无用文件屏蔽-->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-war-plugin</artifactId>
    <version>2.4</version>
    <configuration>
        <packagingExcludes>
            front-end/node_modules/,
            front-end/src/,
            front-end/.gitignore,
            front-end/*.js,
            front-end/*.json
        </packagingExcludes>
    </configuration>
</plugin>
{% endhighlight %}

D. 在web项目中将静态资源请求转至前端输出目录,以spring mvc为例

{% highlight xml linenos%}
<bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
<!-- 这里的固定输出目录为前端项目中的static目录-->
  <property name="prefix" value="/front-end/static/" />
  <property name="suffix" value=".html" />
</bean>

<!-- 静态资源映射配置,当然,除了JS,别的也可以,甚至是上面的HTML你也可以这么干-->
<mvc:resources mapping="/js/**" location="/front-end/static/js/" />
{% endhighlight %}

E. 接下来就可以打包运行了

##Clone一个现有的后端项目  
由于采用了git submodule,在clone的时候需要

{% highlight Bash shell scripts linenos%}
git clone --recursive repository_path
{% endhighlight %}

##切换后端项目分支

{% highlight Bash shell scripts linenos%}
git checkout new_branch
git submodule update  #这步很重要
{% endhighlight %}

##更新前端代码

{% highlight Bash shell scripts linenos%}
cd src/main/webapp/front-end #cd到前端目录
git pull
{% endhighlight %}

##备注  
该方案强烈依赖于git submodule功能,所以强烈建议先仔细学习该功能.
关于git无法跟踪submodule分支的问题参看[这里](http://stackoverflow.com/questions/1777854/git-submodules-specify-a-branch-tag)
