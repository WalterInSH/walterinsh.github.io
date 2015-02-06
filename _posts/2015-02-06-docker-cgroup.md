---
layout: post
title: Docker cgroup
date:   2015-02-06
---

Docker使用了linux中的cgroup来实现container的资源管理。本文简述docker中cgroup的使用和cgroup的原理。

##查看container可以使用的资源配置

既然cgroup限制了container使用的资源，那我们先启动一个container，看看它的限制，以内存为例(可以通过-c参数限制cpu)

{% highlight Bash shell scripts %}
# docker  run -d -m=10m -t centos sleep 3600
55fc03ef1389b0da0064fd54fa76aaee8f5656389f69d63886732dc93bc7013d
{% endhighlight %}

然后我们看一下它内存使用的信息，信息存放在"/sys/fs/cgroup/memory/system.slice", 具体的Container信息存放在"docker-<ContainerID>.scope"中(这里针对CentOS，和官方文档不一致).

{% highlight Bash shell scripts %}
# cat docker-55fc03ef1389b0da0064fd54fa76aaee8f5656389f69d63886732dc93bc7013d.scope/memory.stat
cache 2818048
rss 90112
rss_huge 0
mapped_file 475136
swap 0
pgpgin 737
pgpgout 27
pgfault 220
pgmajfault 4
inactive_anon 0
active_anon 90112
inactive_file 2715648
active_file 102400
unevictable 0
hierarchical_memory_limit 10485760<- 10M 
hierarchical_memsw_limit 20971520
total_cache 2818048
total_rss 90112
total_rss_huge 0
total_mapped_file 475136
total_swap 0
total_pgpgin 737
total_pgpgout 27
total_pgfault 220
total_pgmajfault 4
total_inactive_anon 0
total_active_anon 90112
total_inactive_file 2715648
total_active_file 102400
total_unevictable 0
{% endhighlight %}

我们从这个文件中可以看到关于这个container内存的信息。例如我们启动时设置的最大内存10485760byte(10M)。

##什么是cgroups

Red Hat Enterprise Linux 6 提供了一个control groups功能，简称cgroups. 允许你给一组进程分配一定的资源，例如CPU、内存。你可以监控这一组进程，阻止其访问敏感资源，甚至可以在运行时修改其配置。

cgroups通过分层(hierarchically)管理，其有child cgroups. child cgroups可以从parent cgroup继承一些属性.

cgroups的设计很像linux进程的设计，结构就像一棵树一样，主要不同的地方在于Linux进程是一棵树(Linux进程都是init进程的子进程), 但是多个不相关的cgroups层级结构(hierarchies of cgroups)可以同时存在，就像同时有多棵没有关系的树.后文中将称每一个这样的cgroups结构为hierarchy.

##subsystems

cgroups提供了subsystem(resource controllers)作为资源的控制器，Red Hat Enterprise Linux 6提供10种subsystem:

blkio - 限制对块设备(block devices)的读写，例如硬盘  
cpu - 限制对CPU的使用  
cpuacct - 自动生成CPU的使用报告  
cpuset - 分配一个CPU(on a multicore system)和内存节点  
devices - 限制对设备的访问  
freezer - 恢复或暂停某一个cgroups  
memory - 限制对内存的使用，同时生成内存使用报告  
net_cls - 标记网络包，允许Linux traffic controller识别从特定cgroups中发出的包  
net_prio - 动态设置每个网络接口的优先级  
ns - 命名空间  

上面memory.stat输出的内容就是memory subsystem提供的

##Subsystems, Hierarchies, Control Groups, Tasks之间的关系

规则1(图取自官网)  
cgroups是层级结构的，每个hierarchy都可以有多个subsystem，但是不能有重复的subsystem.

<img src="/images/posts/cgroup1.png"/>

规则2  
一个subsystem可以属于多个hierarchy，只要这些hierarchy只有同一种subsystem.

<img src="/images/posts/cgroup2.png"/>

规则3  
当一个新hierarchy被建立，默认所有task都属于这个hierarchy，它被成为root hierarchy. 每一个task可以属于某一个hierarchy中的某一个cgroup, 每一个task可以属于不同hierarchy的多个cgroup.如果一个task被赋予一个hierarchy中的另一个cgroup,之前的cgroup将失去这个task.

<img src="/images/posts/cgroup3.png"/>

规则4  
一个子task和父task属于同一个cgroup. 但是它们是独立的两个task，修改其中一个task的cgroup不会影响另一个.

<img src="/images/posts/cgroup4.png"/>

参考  
https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Resource_Management_Guide/ch01.html
