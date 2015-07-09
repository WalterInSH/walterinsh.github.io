---
layout: post
title:  加密github公开项目中的敏感文件
date:   2015-07-09
---

[git-encrypt](https://github.com/shadowhand/git-encrypt)是我很久以前发现的一个项目，
当时了解了一下它是个什么东西，但是并没有用起来。直到最近做一个小工具，发现git-encrypt正适合我的要求。便记录一下这个工具的使用。

###git-encrypt是什么

git-encrypt是一个加密工具，它可以加密你git repository中敏感的文件。例如加密你项目中的数据库连接信息。

当然，这些敏感的东西最好不要push到公网。但是每次pull代码下来，再手工填这些敏感信息又太麻烦，push前再删除，
有时候不小心就push出去了。所以你可以配在环境变量里，安全又方便。

这么说，把需要加密的东西都放本地不就可以了。可是对于这种写着玩的项目，我懒。╮(╯﹏╰）╭

###如何安装

项目readme有很详细的介绍，对于mac用户一行命令搞定

{% highlight Bash shell scripts %}
brew install git-encrypt
{% endhighlight %}

###如何使用

打开一个git项目，初始化git encrypt

{% highlight Bash shell scripts %}
gitcrypt init

它会询问你是否随机生成盐（加密用的），这个选Y

然后是询问密码，我一般挑个人脑能记住的密码，不太会用随机生成，什么密码都用keypass也怪累的。

接下来是加密算法和你想加密什么文件
{% endhighlight %}

当你再次修改了需要被加密的文件，并push到remote之后，文件内容就已经是被加密的了。即便这个项目是public的，也无人知晓这个是什么。

###使用github private repository呢？

无论github 还是bitbucket，虽然都有private项目，权限管理也很不错。但是代码毕竟是交出去了，
出了公网就有可能泄露，即便github bitbucket很有节操，但是难保有漏洞被恶意使用。
