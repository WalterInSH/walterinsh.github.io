---
layout: post
title: 让FDS飞起来的前端项目
date:   2015-04-04
---

FDS全称fraud detection system, 是唯品会风控系统的主要产品, 为唯品会检测可疑交易或者恶意访问.
由于目前我们没有前端工程师, "高工不屑于做页面, 架构师不会写代码(kidding)", 所以我就经常要做些前端页面.
那么我这个二把刀的前端工程师是如何做的呢?

###放弃该放弃的

首先FDS主要是一个API service, 有界面的是它的后台管理, 理论用户数很少, 我们给自己的要求大致是:

1.完全只兼容chrome  
2.主要考虑台式机23吋的显示器, 笔记本挤不下就算了  
3.界面简单易用  
4.开发速度快

我们提出这些要求并不是拍脑门.

只兼容chrome会对用户有要求, 要求他们必须安装chrome. 但是如同我在另一篇博客中说明的

>一个公司内部的应用,要的是什么?!要的是加快公司的发展!要的是比竞争对手的分析展示工具更强大!要的是人无我有,人有我全,人全我快!  
一个公司内部的应用,不要的是什么?!前端角度不和别人拼谁兼容的浏览器多!

第二点是出于使用我们系统的90%的人是这个配置, 而我不会做分比率适配, 为另外10%的人做分辨率适配将花去我们大量的时间, 性价比太低.

第三点好解释, 我们已经放弃了一些用户体验, 最核心的体验不能丢掉.

关于最后一点, 互联网企业嘛, try fast, fail fast.

总之,我们在一开始就决定放弃那些不重要的功能, 专心做核心功能, 不求完美.


###github啥都有

在做页面的时候会有很多组件是我不会的, 什么notification, popup, date picker之类的, 当需要这些组件的时候我首先会去github上搜,
基本都能搜到, 拿来用就好了, 有时会比你想象的还要好用.

既然我是个二把刀的前端, 我当然要尽量利用现成的, 不要重复造轮子, 何况我还造不出来, 呵呵呵呵呵呵.

罗列几个我使用的几个框架

[Semantic-UI](http://semantic-ui.com):你是不是厌倦了bootstrap, semantic也许会让你心动, 和bootstrap类似也很清新, 但是semantic会更时尚更多变.
但是semantic还不够成熟, 有一些常用的组件缺失, 虽然有人issues但是也需要时间.

[datetimepicker](https://github.com/xdan/datetimepicker): semantic缺失date time picker, 这个项目是个很好的替代方案,
同时支持angularjs. 很巧的是其控件配合和semantic很搭, 你几乎不需要做什么.

[angular-semantic-ui](https://github.com/angularify/angular-semantic-ui):semantic遇到angularjs经常瓦特,
这个项目实现了几个主要的控件, 特别是dropdown, 简直救了我.

[Minijs](http://www.minijs.com/):我们使用了这套框架中的notification组件.

[js message](http://dhtmlx.github.io/message/): 一个提供了类似JetBrains IDEA右上角提示的框架.
但是给的几个主题都丑爆了, 我改了它的样式, 以搭配semantic.

[sweetalert](http://tristanedwards.me/sweetalert):扁平且和semantic很配的alert组件.

###考虑团队能力

我们项目中用到了图表, 当时备选的[D3](http://d3js.org/)和[highcharts](http://www.highcharts.com/),
后来选择了highcharts, 因为感觉D3虽然效果炫的一塌糊涂, 但是以我目前的前端水平,估计很难驾驭. 可能炫炫的效果没出来, 还用了成倍的时间.
highcharts做了很好的封装, API简单, 效果也是相当好.

虽然D3灵活, 虽然D3牛逼, 虽然D3效果好, 但是要考虑自己的能力是否能驾驭. 按照Demo做出来一个很炫的图, 并不意味着你能驾驭它, 你要考虑:

1.你能否在Demo的基础上更进一步  
2.如果你休假甚至是离职了, 你的同事有没有能力接手, 他们要花多少时间接手  
3.出Bug了能否快速定位问题  

如果你引入了一个会拖慢你开发速度的框架, 而拖慢的原因是你看着它牛逼但不能驾驭它, 那这个选型是失败的.

###给用户获取帮助的渠道

从"二把刀做出来的东西肯定不易用"这个想法出发, 我们系统中肯定有很多有疑惑的部分, 所以要积极听取用户的抱怨,
快速获取反馈, 然后改正它们.

所以我在系统最下面加了醒目的"获取帮助"按钮(和一个打赏我们咖啡的按钮). 保证用户在任何页面都可以直接发起帮助.
