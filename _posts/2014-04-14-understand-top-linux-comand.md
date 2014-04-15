---
layout: blog
title: linux top 命令指标简介
---

Top是linux中常用来了解系统运行状况的命令,一眼看过去有CPU和内存等信息,但是,仍有很多不知道是什么.这篇blog旨在解释top信息中的不同指标是什么意思.先上图.


<img src="/image/posts/linux-top-command.png"/>

最开始显示了当前时间,机器启动了多久,当前有几个用户(session).较为简单,不多做解释.

### load average
CPU的平均负载,三个数字分别表示1分钟内,5分钟内和15分钟内的平均负载. 需要注意的是,这个值不是CPU的使用率(usage),而是反映CPU执行/等待队列的进程量的量,不是每一个进程都会占用很长时间.如何理解这个值呢,当这个值是多少的时候值得你注意呢?

Unix定义CPU负载: 当前正在执行进程数 + 正在等候执行的进程数

我们看到的这个值是通过 'CPU负载 / processor数量' 得到的. 如果机器是单核处理器, 1代表processor有工作.如果是多核处理器,那么这个阈值将是核数.所以在4核处理器上,3.50依然不会让你的电脑宕机.

一般认为,值在阈值的70%的时候,就要考虑是否是个问题了.当为阈值100%的时候,需要立刻找到问题.大于100%的时候,问题已经严重了.

有时Load average高但是CPU usage低,说明很多进程都和CPU打交道,但是压力不在CPU,大家都在队列里等着,可能是在等I/O,这个时候可以结合别的看看I/O是不是有问题.

### Tasks
linux内核正在管理的任务数,先上图

<a href="#nogo">
    <img src="/image/posts/procflow.gif"/>
</a>

这张示意图展示了linux是如何管理Task的生命周期的, tasks后面显示的就是不同状态的task有多少.[延伸阅读](http://www.linuxuser.co.uk/features/life-cycle-of-a-process)

### CPU
man中解释如下,还是非常简单清楚的,随后补充一些迷惑的地方

| Name          | Description                     |
| ------------- | --------------------------------|
| us |  time running un-niced user processes      |
| sy |  time running kernel processes             |
| ni |  time running niced user processes         |
| id |  idle cpu time (or) CPU time spent idle    |
| wa |  time waiting for I/O completion           |
| hi |  time spent servicing hardware interrupts  |
| si |  time spent servicing software interrupts  |
| st |  time stolen from this vm by the hypervisor|

un-niced : nice值为0的进程,nice值越高,被cpu执行的机会越少.nice值的范围是 -20 ~ 19

如果us或者sy长时间占去了CPU时间,首先应该定位是哪个进程占用的,这个从下面的列表中可以得出

对于wa过高,最后我会给出一个便利的工具排查问题,你也可以通过[这篇blog](http://bencane.com/2012/08/06/troubleshooting-high-io-wait-in-linux/)排除.

关于处理器中断不是本文涉及的部分,可以参考[这里](http://unix.stackexchange.com/a/18023)

st是关于虚拟机的指标,出问题的情况不多吧.详细信息见[这里](http://blog.scoutapp.com/articles/2013/07/25/understanding-cpu-steal-time-when-should-you-be-worried)

### KiB Mem

### KiB Swap