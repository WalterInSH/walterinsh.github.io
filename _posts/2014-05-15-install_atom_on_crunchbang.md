---
layout: post
title: 在debian上安装atom编辑器
date:   2014-05-15
---

Atom是一款很好用的编辑器,目前只提供mac版的包. 但是你可以用源码自行编译安装.详情请看  
https://github.com/atom/atom#building

我已经在我的电脑(debian 64bit)打包了一个deb,可以下载安装,链接如下  
http://pan.baidu.com/s/1mgoL4QO


如果遇到如下报错,你应该升级libc  
{% highlight Bash shell scripts %}
/usr/share/atom/atom: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.14' not found(required by /usr/share/atom/atom)
/usr/share/atom/atom: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.14' not found(required by /usr/share/atom/libchromiumcontent.so)
/usr/share/atom/atom: /lib/x86_64-linux-gnu/libc.so.6: version `GLIBC_2.15' not found(required by /usr/share/atom/atom)
{% endhighlight %}

首先在 /etc/apt/sources.list 文件中加入一行  
{% highlight Bash shell scripts %}
deb http://ftp.us.debian.org/debian/ testing main contrib non-free
{% endhighlight %}

然后执行  
{% highlight Bash shell scripts %}
sudo apt-get update
sudo apt-get install -t testing libc6
{% endhighlight %}

安装结束后把 /etc/apt/sources.list 的那一行删掉

---
Reference

http://axiacore.com/blog/atom-editor-debian/
