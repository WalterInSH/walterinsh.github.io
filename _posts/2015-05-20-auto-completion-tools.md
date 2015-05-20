---
layout: post
title: 各种自动补全工具汇总
date:   2015-05-20
---

###fuzzy bash completion

[Github](https://github.com/mgalgs/fuzzy_bash_completion)

Linux在你使用命令行时,会自动补全路径名,但是前提是你把前几个字母敲对了. 
有没有像IDE那样你随便敲一个路径中包含的子串, 就帮你自动补全的工具吗?

fuzzy bash completion就是为了这个而生.

以下面路径为例:

<img src="/images/posts/current_directory_files.png"/>

当我们想删除2014-10-28-how-to-add-live-template-idea.md这篇文章的时候，我们只需要输入rm templ然后tab一下，就会补全整个文件名，效率比用鼠标复制粘贴要高很多。

以下是安装过程

{% highlight Bash shell %}
#download codes
git clone git@github.com:mgalgs/fuzzy_bash_completion.git
cd fuzzy_bash_completion

#set up
echo "source $(pwd)/fuzzy_bash_completion" | >> ~/.bashrc
echo "fuzzy_replace_filedir_xspec" | >> ~/.bashrc

#enable fuzzy bash completion for cd, ls, and rm command.
echo "fuzzy_setup_for_command cd" | >> ~/.bashrc
echo "fuzzy_setup_for_command ls" | >> ~/.bashrc
echo "fuzzy_setup_for_command rm" | >> ~/.bashrc

#put the following in your ~/.inputrc
echo "set show-all-if-ambiguous on" | >> ~/.inputrc

#finally, start it up
source ~/.bashrc
{% endhighlight %}

###maven bash completion
[Github](https://github.com/juven/maven-bash-completion)

这个项目是为Maven补全命令的. 作者是《Maven实战》的作者.

以后妈妈再也不担心我用4秒才可以敲完mvn install -Dmaven.test.skip=true,可谓是省时间利器.

以下是安装过程

{% highlight Bash shell %}
#download codes
git clone git@github.com:juven/maven-bash-completion.git
cd maven-bash-completion

#set up
echo "source $(pwd)/bash_completion.bash" | >> ~/.bashrc

#start it up
source ~/.bashrc
{% endhighlight %}

###Gradle Dependencies Helper Plugin

[Github](https://github.com/ligi/GradleDependenciesHelperPlugin)

这是一个JetBrains IDEA插件, 补全gradle dependencies. 

<img src="/images/posts/gradle_help_screenshot.png"/>

设置里面虽然可以搜到[一个插件](https://github.com/siosio/GradleDependenciesHelperPlugin),但是不起作用, 外国人民也是先肯定了作者的努力然后打了他的脸.(可能是因为idea升级导致的不兼容) 

<img src="/images/posts/gradle-plugin-comments.png"/>

安装过程

Download the plugin from [here](https://github.com/ligi/GradleDependenciesHelperPlugin/releases)

go to settings->plugins->install from disk and choose the jar you just downloaded

