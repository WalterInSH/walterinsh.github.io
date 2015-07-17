---
layout: post
title:  加密github公开项目中的敏感文件
date:   2015-07-12
---

[git-encrypt](https://github.com/shadowhand/git-encrypt)是我很久以前发现的一个项目，
当时了解了一下它是个什么东西，但是并没有用起来。直到最近做一个小工具，发现git-encrypt正适合我的要求。便记录一下这个工具的使用。

###git-encrypt是什么

git-encrypt是一个加密工具，它可以加密你git repository中敏感的文件。例如加密你项目中的数据库连接信息。

当然，这些敏感的东西最好不要push到公网。但是每次pull代码下来，再手工填这些敏感信息又太麻烦，而且push前要记得删除，
有时候不小心就push出去了。所以你可以配置在环境变量里，安全又方便。

这么说，把需要加密的东西都放本地不就可以了。要git-encrypt干什么？

对于这种写着玩的项目，没必要多写代码读写本地文件或者环境变量，我懒。╮(╯﹏╰）╭

###如何安装

项目readme有很详细的介绍，对于有package manager的用户一行命令搞定

{% highlight Bash shell scripts %}
brew install git-encrypt
OR
npm install -g git-encrypt
{% endhighlight %}

###如何使用

打开一个git项目，初始化git encrypt

{% highlight Bash shell scripts %}
gitcrypt init
{% endhighlight %}

_它会询问你是否随机生成盐（加密用的），这个选Y_

_然后是询问密码，我一般挑个人脑能记住的密码，不太会用随机生成，什么密码都用keypass也怪累的。_

_接下来是加密算法和你想加密什么文件_

当你再次修改了需要被加密的文件，并push到remote之后，文件内容就已经是被加密的了。即便这个项目是public的，也无人知晓这个是什么。

###Decrypting clones

官方README中已经有十分详细的解密过程，只是需要注意两点。

* clone的时候别忘了参数 -n
* 使用gitcrypt init来解密更方便，能不手动就不手动

###使用github private repository呢？

无论github 还是bitbucket，虽然都有private项目，权限管理也很不错。但是代码毕竟是交出去了，
出了公网就有可能泄露，即便github bitbucket很有节操，但是难保有漏洞被恶意使用。

###有用的源码摘抄(shell)

1. 生成随机16位盐

{% highlight Bash shell scripts %}
head -c 10 < /dev/random | $md5 | cut -c-16
{% endhighlight %}

2. 生成随机32位密码

{% highlight Bash shell scripts %}
cat /dev/urandom | LC_ALL="C" tr -dc '!@#$%^&*()_A-Z-a-z-0-9' | head -c32
{% endhighlight %}

3. 查看openssl可用加密算法（git-encrypt使用了openssl）

{% highlight Bash shell scripts %}
openssl list-cipher-commands
{% endhighlight %}

4. 使用openssl加密文件

{% highlight Bash shell scripts %}
#encryption
openssl enc -base64 -$CIPHER -S "$SALT" -k "$PASS"

#decryption
openssl enc -d -base64 -$CIPHER -k "$PASS"
{% endhighlight %}

详细的wiki参看[https://wiki.openssl.org/index.php/Enc](https://wiki.openssl.org/index.php/Enc)
