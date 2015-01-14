---
layout: post
title: 常用二进制计算(不定时更新)
date:   2014-07-24
---

###A - Anding an integer with 0xFF leaves only the least significant byte.

{% highlight HTML%}
    // 21845 & 0xFF
    0 1 0 1 0 1 0 1 0 1 0 1 0 1 0 1
 &  0 0 0 0 0 0 0 0 1 1 1 1 1 1 1 1
    -------------------------------
    0 0 0 0 0 0 0 0 0 1 0 1 0 1 0 1
{% endhighlight%}
