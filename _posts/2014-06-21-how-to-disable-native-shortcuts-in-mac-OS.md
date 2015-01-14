---
layout: post
title: 如何禁用Mac OS原生快捷键
date:   2014-06-21
---

一直感觉在Mac上开发时快捷键是个很烦的问题,经常系统快捷键和IDE的快捷键冲突,在system preferences
里还竟然没有这个快捷键的设置项,又是一个apple反人类的一个地方. 简单找了一下解决方案,亲测有效

step 1:  
双击 ~/Library/Preferences/com.apple.symbolichotkeys.plist 文件(我安装了xcode),如下图  
<img src="/images/posts/mac_hotkey_setting.png" width="450px"/>

step 2:  
从[这里](http://hintsforums.macworld.com/archive/index.php/t-114785.html)找到你要操作的快捷键,并在打开的文件中找到.

step 3:  
更改相应数字(key)的值.单击然后选择NO禁用或者YES启用.

step 4:  
reboot

---

Preference

[how to edit plist file](http://www.cnet.com/news/preferences-files-the-complete-story-part-vii-plist-file-tricks/)
