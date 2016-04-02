---
layout: post
title:  快速搭建 Shadowsocks
date:   2015-08-21
rmdtext: 重新认识全栈工程师
rmdurl: /2016/01/16/full-stack-engineer.html
---

本文介绍如何搭建科学上网利器 Shadowsocks。

### Step 1 购买VPS(virtual private server)

我选用的是Digital ocean新加坡的机器，每月5刀，速度足够了。

通过[这个链接](https://www.digitalocean.com/?refcode=ab03476f0125)购买可以免费使用2个月（10刀）

购买后建立一个Droplet,我选用的是centos 7 x64

记住IP，下文用ADDRESS-IP表示

### Step 2 VPS安装Docker

{% highlight Bash shell %}
yum install -y docker

systemctl start docker
{% endhighlight %}

### Step 3 VPS安装 shadowsocks-libev

{% highlight Bash shell %}
docker run -p 8388:8388 -e "PASSWORD=YOUR-PASSWORD" vimagick/shadowsocks-libev
{% endhighlight %}

用一个自己的密码将命令中的YOUR-PASSWORD替换掉，之后我们会用到这个密码

### Step 4 本地安装Client

#### Linux

{% highlight Bash shell %}
git clone git@github.com:shadowsocks/shadowsocks-libev.git
cd shadowsocks-libev

sudo apt-get install build-essential autoconf libtool libssl-dev

./configure && make
sudo make install
{% endhighlight %}

#### Mac OSX

安装 ShadowsocksX

### Step 5 启动Client

#### Linux

{% highlight Bash shell %}
nohup ss-local -s "ADDRESS-IP" -p "8388" -l "8388" -m "aes-256-cfb" -k "YOUR-PASSWORD" >/dev/null 2>&1 &
{% endhighlight %}

用你之前设置的密码替换YOUR-PASSWORD，用购买droplet时的IP替换ADDRESS-IP

#### Mac OSX

按照要求填写信息，密码就是之前设置的，IP地址是你之前购买droplet的地址，端口是8388

### Step 6 在Chrome中安装Proxy SwitchySharp

前往[这里](https://chrome.google.com/webstore/detail/proxy-switchysharp/dpplabbmogkhghncfbfdeeokoefdjegm)安装Proxy SwitchySharp

安装好之后打开配置界面。

Proxy profiles tab中增加一个Profile,例如叫Shadowsocks。在Manual Configuration -> SOCKS Host 填写127.0.0.1，port：8388。

Switch Rules tab中 Online Rule List 中粘贴地址 https://autoproxy-gfwlist.googlecode.com/svn/trunk/gfwlist.txt 自动获取需要**的列表。
同时在Proxy Profile下拉框中选择Shadowsocks.

这样基本就可以上你想上的网站了，更多Proxy SwitchySharp的使用技巧请进一步Google。

### Step 6(optional) 安装proxychains

proxychains可以方便你在命令行使用shadowsocks。

{% highlight Bash shell %}
sudo apt-get install proxychains
{% endhighlight %}

在 ~/.proxychains/proxychains.conf创建proxychains的配置文件，将下面文本复制进去

{% highlight Text %}
strict_chain
proxy_dns
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000
localnet 127.0.0.0/255.0.0.0
[ProxyList]
socks5 	127.0.0.1 8388
{% endhighlight %}

然后在命令行执行命令时，增加proxychains便可以使该命令使用shadowsocks，例如

{% highlight Bash shell %}
proxychains wget https://www.google.com
{% endhighlight %}
