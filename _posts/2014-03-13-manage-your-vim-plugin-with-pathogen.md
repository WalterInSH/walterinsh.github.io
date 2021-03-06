---
layout: post
title: 用pathogen管理vim 插件
date:   2014-03-13
---

Vim 插件可以加快我们在Vim中编辑的效率,实现快速定位到某个文件,更友好的Tab界面,代码提错等功能.

传统的安装Vim 插件需要手工下载到.vim目录, 更新或者删除这些插件都将是一件挺麻烦的事.但是如果使用pathogen来管理vim插件,一行命令就可以安装一个插件,一行命令就可以更新所有插件,删除也是如此的方便.

安装过程
===

A.安装git

{% highlight Bash shell scripts linenos%}
apt-get install git
{% endhighlight %}

B.安装 pathogen

{% highlight Bash shell scripts linenos%}
mkdir -p ~/.vim/autoload ~/.vim/bundle;
curl -Sso ~/.vim/autoload/pathogen.vim https://raw.github.com/tpope/vim-pathogen/master/autoload/pathogen.vim
{% endhighlight %}

C.配置pathogen

{% highlight Bash shell scripts linenos%}
execute pathogen#infect()
{% endhighlight %}

将上面的代码加入 ~/.vimrc 文件,如果没有这个文件,就新建一个.

D.将.vim目录作为一个git目录

{% highlight Bash shell scripts linenos%}
cd ~/.vim
git init
{% endhighlight %}

你可以将这个目录push到github或者别的代码托管服务上,这样,你就可以快速的将已有的配置部署在别的机器上

安装管理插件
===

A.安装插件, 我们以安装 [sensible](https://github.com/tpope/vim-sensible) 为例

{% highlight Bash shell scripts linenos%}
cd ~/.vim
git submodule add git://github.com/tpope/vim-sensible.git bundle/sensible
{% endhighlight %}

这样子就安装好了,有些插件要求进一步配置

B.一次更新所有插件

{% highlight Bash shell scripts linenos%}
cd ~/.vim
git submodule foreach git pull origin master
git add -A
git commit -m "update submodules"
#Then you can push your changes
{% endhighlight %}

C.删除某一个插件
删除 .gitmodules 中该插件的配置然后

{% highlight Bash shell scripts linenos%}
rm -rf bundle/plugin_name
{% endhighlight %}
