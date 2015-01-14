---
layout: post
title: 如何使用Idea live template
date:   2014-10-28
---


在使用Idea的时候我们可以使用sout/fori/ritar等缩写生成一段模版固定的代码，下文介绍如何自定义这个模版.

​
以增加我们常用的Slf4j Logger为例  


Step1  
Ctrl+Alt+s打开设置，搜索到"Live Template".


Step2  
点击那个右边的加号,选择"Live Template"增加一个模版. Idea默认会帮你创建一个"user"模版组.


Step3  
在下方的"Abbreviation"框中输入模版的缩写，例如"lg"  
在"Description"中输入描述  


Step4  
在Template Text中输入  
private final static org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger($CLASS_NAME$.class);  
这个地方我们定义了一个变量


Step5  
点"Edit variables"，这里列出了我们刚刚定义的"$CLASS_NAME$" 变量,在"Expression"中选择"className()"，勾选最后的"Skip if defined"


Step6
点击OK，回到一个Java Class中,在class body中输入lg,然后按Tab键, 你就自动得到了一个Logger




通过类似的方法，你还可以创建更多模版，让自己的开发变得更快
