---
layout: post
title: Docker Container之间如何通信
date:   2015-01-18
---

##本文通过例子简要介绍Docker link的使用和背后的原理. 我们会建一个Redis Container和一个Python Container,然后用Python连Redis.然后讲这背后的原理.

首先感受一下Docker的方便之处,一键安装&运行Redis

{% highlight Bash shell scripts %}
docker run -d --name redis redis:latest
{% endhighlight %}

从[Redis的Dockerfile](https://github.com/docker-library/redis/blob/master/2.8/Dockerfile)中我们可以知道redis已经监听在6379端口了

然后我们创建python container. 这里使用link参数将python和redis两个container连接起来.格式是"containerName:alias".

我们在python container启动之后通过执行"/bin/bash"进入Container执行python脚本.

启动后我们发现python container的hosts文件中将本container(91e90e9b5365)指向了172.17.0.26,将redis指向了172.17.0.25.我们一会儿就要使用172.17.0.25这个IP连接redis.

{% highlight Bash shell scripts %}
docker run -t -i --name python --link redis:redis_alias python:latest /bin/bash

...

root@91e90e9b5365:/# cat /etc/hosts
172.17.0.26	91e90e9b5365   <-
ff00::0	ip6-mcastprefix
ff02::1	ip6-allnodes
ff02::2	ip6-allrouters
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
172.17.0.25	redis_alias    <-
{% endhighlight %}

如下,我们在python container内部已经可以成功读写redis了
{% highlight Bash shell scripts %}
root@91e90e9b5365:/# pip install redis
root@91e90e9b5365:/# python
Python 3.4.2 (default, Jan  1 2015, 13:14:17)
[GCC 4.9.1] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import redis
>>> r = redis.StrictRedis(host='172.17.0.25', port=6379, db=0)
>>> r.set('data_key','data_value')
True
>>> r.get('data_key')
b'data_value'
{% endhighlight %}

##原理详解
首先我们在启动container的时候没有通过Port参数对外直接开放端口供访问,而是使用link,link可以使container间的信息传递更安全.

这里docker使用了linux的bridge.Bridge可以被看做在Host机器上建立一个虚拟子网,连接多个Docker Container的网卡(虚拟网卡),然后供Container之间通信.

>A bridge is a way to connect two Ethernet segments together in a protocol independent way. Packets are forwarded based on Ethernet address, rather than IP address (like a router). Since forwarding is done at Layer 2, all protocols can go transparently through a bridge.

从Bridge定义看出来,Docker间的信息交换是发生在OSI模型的的第二层(Data link层,IP协议在第三层的Network).基于Ethernet address(也就是Mac地址)发送信息,每个Container都有一个虚拟的Ethernet address.

>When Docker starts, it creates a virtual interface named docker0 on the host machine. It randomly chooses an address and subnet from the private range defined by RFC 1918 that are not in use on the host machine, and assigns it to docker0. Docker made the choice 172.17.42.1/16 when I started it a few minutes ago, for example — a 16-bit netmask providing 65,534 addresses for the host machine and its containers.

在Docker启动的时候会创建一个Bridge叫"docker0",我的信息类似下面这个.


{% highlight Bash shell scripts %}
[root@WalterInSH ~]# ifconfig
docker0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 172.17.42.1  netmask 255.255.0.0  broadcast 0.0.0.0
        inet6 fe80::5484:7aff:fefe:9799  prefixlen 64  scopeid 0x20<link>
        ether 56:84:7a:fe:97:99  txqueuelen 0  (Ethernet)
        RX packets 398  bytes 83086 (81.1 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 296  bytes 119252 (116.4 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

...

[root@WalterInSH ~]# brctl show
bridge name	 bridge id		     STP enabled	interfaces
docker0		 8000.56847afe9799	 no		        vethced123b
                                                veth7cd74c6
                                                vethad96052
{% endhighlight %}

Docker每次创建Container,Docker都会创建一对"peer",就像一根管子的两头,一头接在Container里的eth0
(在上面的python container中输入"ip addr show"可见),另一头接在Host机的docker0上,且赋一个以veth开头的名字
(上面就是启动3个Container时的效果).docker0会自动转发所有它收到的包,这样Container就可以和Host或者别的Container通信了.

至此,我们便知道了Docker Container之间的通信方式了

更多Docker Bridge的控制方式参看[https://docs.docker.com/articles/networking/](https://docs.docker.com/articles/networking/)
