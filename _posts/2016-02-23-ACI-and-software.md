---
layout: post
title:  Air Crash Investigation 和软件开发
date:   2016-02-23
rmdtext: 想要方便的增加Cron Job
rmdurl: /2016/01/14/use-whenever.html
---

这篇blog的是我两年前在看完Air crash investigation这部纪录片后的所思所想，早想拿出来写写，一直未得空，最近三哥邀我去交流经验，不如趁机写写。

回想自己的技术增长，很多都是在犯错中成长起来的，而航空产业也是这样，现在的民航客机如此安全，完全是在一次次教训中长大的，只不过这个教训的背后很多时候是一条条生命。在这样的犯错成本下，航空业有自己一套严谨的方法论，涉及设计、研制、测试、交付、维护、事故调查、问题修复方方面面。不如，我们就从这个领域学些东西，用到软件开发中来。

### American Airlines Flight 1420

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

### Malaysia 370

<img src="/images/posts/aci/mh370-on-radar.png"/>

这是一起中国人十分熟悉的事件，2014年3月8日一架从马来西亚飞往中国的波音777离奇失踪，至今未能确定坠毁地点。这次飞机失踪的十分突然，机组没有求救，航线附近没有残害。人们怀疑是十分严重的事故导致了飞机坠毁，怀疑是恐怖分子安放了炸弹，怀疑是劫机，还怀疑是飞行员有意关闭了通讯装置然后驾着飞机自杀。

在这个人手一台手机，天上都是卫星的高科技时代，人们想到的第一个寻找飞机的方式是通过雷达——这个家喻户晓的技术。当时飞机飞出了马来西亚的雷达管控区，准备进入越南，而在这之间是茫茫大海，并没有商用雷达覆盖（地球很大面积都没有雷达覆盖）。这条路暂时走不通了。

远在伦敦的工程师得知MH370的事情，发现可以通过飞机上一个和卫星通信的装置定位飞机，而且这个装置很难被人为的关掉。这个装置定时会链接卫星，汇报一些信息，但是并不是专门为了定位飞机用的。

<img src="/images/posts/aci/mh370-change-direction.png"/>
通过这个装置和几天后马拉西亚军方提供的信息，人们得出在飞机消失后的几个小时，飞机改变了航向。同时也有目击者报告看到了一架大型客机低飞。

再后来的事情我就不多说了。

对于这次离奇的实践，民航业为了杜绝这种事情再次出现，决定强制没架民航客机都安装GPS。这时你才发现原来上亿美金的波音777客机定位功能都没有，而这几乎每一台手机都会安装的廉价装置。

这次事故造成239人遇难，在软件行业肯定是p0事故了。而这样的事故，暴露出来：即便是技术很发达的系统，依然会犯“缺失基础监控”的毛病，而解决办法是多么的廉价。

[出处](https://www.youtube.com/watch?v=kxEIRvkuQq0)

### UPS Airlines Flight 6

2010年9月3日一架从迪拜起飞不久的货运飞机发生了异常，仪表盘显示货仓起火。

<img src="/images/posts/aci/ups-fire-alert.png"/>

起火对于正在飞行的飞机是十分致命的，机长果断决定

1. 返航并尽快降落
2. 同时开启了货仓的灭火装置（抽走货仓的空气）
3. 佩戴氧气面罩
4. 关闭自动驾驶系统

以上操作都十分标准和专业，但是火势并没有被控制，相反，更严重的报警起火响起，而且驾驶舱出现了烟雾。

<img src="/images/posts/aci/ups-fire-alert2.png"/>

真的是祸不单行，就在下降过程中，手动驾驶出现了问题，机长的氧气面罩突然没有了供氧，驾驶室的烟雾遮挡住了驾驶员看仪表板的视线，起落架也无法放下。此时驾驶员的心情如下图。这时距离到达迪拜机场还有20多分钟。

<img src="/images/posts/aci/ups-smoke-mask.png"/>

最后，这架飞机还是坠毁了，两名驾驶员无一幸免。

经过分析飞机黑匣子，还原整件事情的始末并不难，通过调查员在追击现场附近也找到了散落在地面的元凶：锂电池。

通过黑匣子记录的火势发展情况和飞机构造进行对比，不难看出这次火灾发生在驾驶舱的正下方，这里汇集了众多至关重要的电路，其中就包括手动驾驶系统的关键部件、机长的供氧系统、起落架系统。火灾不仅让驾驶舱充满了烟雾，还烧坏了这些重要的控制设备。

<img src="/images/posts/aci/ups-elec-lines.png"/>

但是调查员还是不相信小小的锂电池真的可以造成如此大的火灾吗？特别飞机货仓本身包裹有防火材料。

<img src="/images/posts/aci/ups-cargo-fire-shield.png"/>

实践出真知，调查员将一批锂电池集中在一起点燃，剧烈的爆炸和超高的燃烧温度震惊了调查员！锂电池这个锅是背定了。

为了避免类似的惨剧再次发生，UPS改造了货仓，使用了独立耐高温的货柜，同时增加了一个驾驶舱防烟雾装置。

<img src="/images/posts/aci/ups-fire-protected.png"/>

<img src="/images/posts/aci/ups-smoke-protected.png"/>

这次发生在航空货运的惨剧给了我们很多反思，特别是因为货仓起火导致很多重要系统甚至是驾驶员不能正常工作，反思是：

1. 重要的系统要有独立的保护
2. 每个系统要控制其失控后的波及范围，特别是高危系统
3. 要做好监控，这样可以更快还原事故过程

[出处](http://www.bilibili.com/video/av3700795/)

### Asiana Airlines Flight 214

<img src="/images/posts/aci/214-hit-seawall.png"/>

2013年7月6日一家从首尔飞往旧金山的波音777准备降落,却撞在了跑道尽头的防波堤上。事故共造成3人死亡，181人受伤。死亡的遇难者中，一人因为未系安全带。

NTSP排除了引擎故障和天气的原因，从空管那里得到了一条有用的线索：跑道尽头的"glide slope"当天因为施工无法使用。glide slope可以引导自动驾驶系统以一个准确的角度降落。

<img src="/images/posts/aci/214-runway-signal.png"/>

由于自动系统无法使用，那是不是人为失误呢？特别是在以降落难度高的旧金山机场。于是调查员怀疑是否是空管给的指令有误。但是经过观察，在空管相同指令下，别的飞机都轻松降落，那只剩下飞行员需要怀疑了。但是两名飞行员都是经验十分丰富，分别有1万小时和1.2万小时的飞行经验，真的会犯降落高度过低的低级错误吗 ？

调取了FDR数据后，发现了一个疑点，在事故发生前1分钟，飞机被设置为了慢车(idle)。接下来是CVR的数据，对比着FDR的数据，调查员发现了第一个疑点：在降落过程中，机长认为飞机降落的不够快，于是修改了驾驶参数，而机长每做一次操作，first officer 并没有回应。直到机长鬼使神差的误启动了飞机的"flight level change mode"同时又将飞机改为慢车。而这，他并没有告知first officer。

<img src="/images/posts/aci/214-flight-level-change-mode.png"/>

调查员叫来了机长，希望能得知当时发生了什么，驾驶员质疑“空速保护系统”没有正常工作，这个系统本应防止飞机发生这样的事故。得到信息的调查员通过模拟发现了这个系统确实有bug，而飞行员一系列罕见的操作触发了这个bug,关闭了空速保护系统。

调查员也发现经验如此丰富的机长在事故当时十分紧张，因为他需要手动驾驶飞机降落在没有辅助系统的跑道。调查员惊奇的是，这应该是学员一开始就要学的必须技能。疑惑的调查员联系了韩亚航空的人员，得知韩亚鼓励飞行员尽量使用自动系统，极少提供手动驾驶的培训，而事故发生时，是机长第一次在没有glide slope的辅助下降落。

即便如此，为什么他没有向first officer求助？！

同时在本次事故中，调查员发现飞机大部分滑梯并没有正常充气打开。这有可能是因为剧烈的冲击导致的。为了弄清楚，调查员使用了汽车碰撞试验使用的设备。果不其然，大部分滑梯在受到剧烈碰撞时都无法使用了。

<img src="/images/posts/aci/214-test-inflation-system.png"/>

到此整个事故可以下结论了，但是调查员内部有了分歧。现在的飞机有大量自动化系统，又多又复杂，驱使飞行员水平越来越低，对飞机的了解也越来越糊涂。那么到底责怪系统太过复杂搞晕了驾驶员，还是责怪驾驶员自身能力不足呢？

这次事故可以给软件行业什么启示？

1. 开发、运维对于系统的更改，应该是有记录的，可以被人明显看到的，要有良好的沟通。最好是有人double check的。
2. 自动化系统应该尽量简单，避免误操作
3. 不能过分依赖自动化系统，技术人员的基本功要扎实
4. 关键系统要进行压测

[出处](http://www.bilibili.com/video/av3613944/)

## 总结

看了那么多集ACI, 对于航空业的印象有以下吧：

1. 实验精神：飞机的材料、结构设计、引擎等每个部件都要保证高度安全可靠，没有严谨的实验是做不到的
2. 不惜代价找到原因：法航447航班坠入大海，经过3年终于查明真相。如果一次事故是由于飞机的问题，如果不查明，风险是巨大的。因为一样的飞机每天都带着无数乘客旅行
3. 认真：有些事故后的飞机已经面目全非，调查员为了找到原因一片片重新拼起来，也是够拼的
4. 改进：对于发现的问题，航空业总在通过改进技术或者流程以免更多惨剧发生，是问题就要面对

其实想一想，似乎这些道理都是很熟悉的，航空业的很多设计也都能在软件领域找到，不是什么独门诀窍。但是在软件行业，类似的问题暴露出来时就不如航空领域那么凸显，不能引起人们的重视。

我总结的不一定和你想的一样，没准你有更好的理解，但是不重要。重要的是当你面临设计上的困境的时候，不如看看别的行业的书或者纪录片，没准有些意外的收获。