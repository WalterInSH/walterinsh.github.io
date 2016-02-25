---
layout: post
title:  Air Crash Investigation 和软件开发
date:   2016-02-23
---

这篇blog的是我两年前在看完Air crash investigation这部纪录片后的所思所想，早想拿出来写写，一直未得空，最近三哥邀我去交流经验，不如趁机写写。

回想自己的技术增长，很多都是在犯错中成长起来的，而航空产业也是这样，现在的民航客机如此安全，完全是在一次次教训中长大的，只不过这个教训的背后很多时候是一条条生命。在这样的犯错成本下，航空业有自己一套严谨的方法论，涉及设计、研制、测试、交付、维护、事故调查、问题修复方方面面。不如，我们就从这个领域学些东西，用到软件开发中来。

###American Airlines Flight 1420

<img src="/images/posts/aci/busy-runway.png"/>

繁忙的机场，航空公司在准点率上压力很大。1999年6月1号美航1420还未起飞就背负了晚点的压力，更重要的是暴风雨来临。在接下来的1个小时里，要么起飞，要么取消。最终，航空公司还是决定起飞，于是快速让乘客入座，系好安全带，晚点2个小时后起飞了。一切似乎都慌慌张张。

<img src="/images/posts/aci/storm-is-coming.png"/>

起飞后一切似乎正常，但是暴风雨已经慢慢形成，在飞机和目的地之间只有慢慢收紧的一条路。

飞机快到达目的地时，飞行员开始和塔台通信，也渐渐意识到天气开始对这次降落会有影响，很显然没有人想在这样的空中多待一秒。机长和副机长开始不停沟通，检查各项指标。这时新的问题产生了，因为天气，能见度不足1km，他们无法找到机场在哪，只能寻求塔台的帮助。此时，机上的乘客感觉到了异常，雷电仿佛就在身边。

最终在塔台的帮助下，飞机找到了跑到的方向，但是过程并不轻松，在迟迟不能看到跑道时，机长越来越紧张。同时塔台告诉他们的不仅是方向，也告诉他们机场有很强的侧风。

<img src="/images/posts/aci/landing-in-rain.png"/>

“I got it!”机长在降落的最后阶段看到了跑道。

放下起落架！紧接着飞机狠狠地和地面接触了，乘客尖叫着，机长紧握晃动的操纵杆，脚踩刹车。

<img src="/images/posts/aci/1420-crash.jpg"/>

但是飞机还是冲出了跑道，10名乘客死亡，机长也未能幸免。

NTSP介入调查，从飞机的轮胎痕迹看出来飞机完全失控了，当在询问飞机两翼的乘客时得知飞机的扰流板没有正常打开，稍后从飞行记录仪中证实了目击者的话。

(正常)
<img src="/images/posts/aci/functional-flap.png"/>
(不正常)
<img src="/images/posts/aci/unfunctional-flap.png"/>

NTSP将目光转向CVR,从录音可以发现，在降落的最后阶段飞行员一直忙于寻找跑道、联系塔台，又是在这样一个雷雨交加伴有侧风的夜晚，飞行员竟然忘记了打开扰流板。这是一个致命的低级错误，直接导致飞机冲出跑道尽头！

>Spoilers create downforce that causes the plane's weight to be borne by the landing gear; about 65 percent of Flight 1420's weight would have been supported by the plane's landing gear if the spoilers are deployed, but without the spoilers this number dropped to only 15 percent.

接下到底谁要负责？美航指控塔台没有给到足够的天气信息，遇难者职责飞行员，NTSP职责美航在这样的天气里没有取消这架航班。

<img src="/images/posts/aci/unfunctional-flap.png"/>

同时NTSP也发现在美国2/3的飞行员即便明知是雷雨天气，即便知道这样很危险，也会选择在这样的天气中飞行。特别是在飞机晚点的情况下，飞行员更会选择这么做。

转过头来想想我们日常的开发，也会遇到delay, 我们是不是也会选择冒险的做法。我们有业务的压力，有竞争对手的压力，有KPI，有倒排期...有时我们平安上线，有时我们的运气就没那么好了。

[出处](https://www.youtube.com/watch?v=HBYDt__ZBvk)

###United Airlines Flight 811

明天继续
