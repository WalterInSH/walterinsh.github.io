---
layout: post
title:  使用Whenever写cron job
date:   2016-01-14
---

[Whenever](https://github.com/javan/whenever)是一个生成cron job的一个ruby工具，最大的优点是可读性很强，特别是对于不常写cron job，原生语法记不住的工程师，让你告别数星星查手册。

###安装

{% highlight Bash shell %}
sudo gem install whenever
{% endhighlight %}

###使用

创建一个config/schedule.rb文件

{% highlight ruby %}
 set :output, "~/Projects/test-whenever/cron_log.log"

 every 2.minutes do
   command "echo hello"
 end
{% endhighlight %}

语法不需要多解释，将job的日志输出到一个指定路径，job的内容是没两分钟输出一句"hello"，运行whenever命令得到如下输出

{% highlight Bash shell %}
0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * /bin/bash -l -c 'echo hello >> ~/Projects/test-whenever/cron_log.log 2>&1'
{% endhighlight %}

whenever将你的配置文件翻译为了cron job的原生语法，同时它还提供了发布功能，支持给一个名字

{% highlight Bash shell %}
whenever -w job-name
{% endhighlight %}

我们查看一下配置好的Job

{% highlight Bash shell %}
crontab -l
# Begin Whenever generated tasks for: job-name
0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44,46,48,50,52,54,56,58 * * * * /bin/bash -l -c 'echo hello >> ~/Projects/test-whenever/cron_log.log 2>&1'


# End Whenever generated tasks for: job-name
{% endhighlight %}

###更多例子

为了更好的说明它的可读性，以下列举一些从官方找到的例子

{% highlight ruby %}
every 3.hours do
  runner "MyModel.some_process"
  rake "my:rake:task"
  command "/usr/bin/my_great_command"
end

every 1.day, :at => '4:30 am' do
  runner "MyModel.task_to_run_at_four_thirty_in_the_morning"
end

every :hour do # Many shortcuts available: :hour, :day, :month, :year, :reboot
  runner "SomeModel.ladeeda"
end

every :sunday, :at => '12pm' do # Use any day of the week or :weekend, :weekday
  runner "Task.do_something_great"
end

every '0 0 27-31 * *' do
  command "echo 'you can use raw cron syntax too'"
end

# run this task only on servers with the :app role in Capistrano
# see Capistrano roles section below
every :day, :at => '12:20am', :roles => [:app] do
  rake "app_server:task"
end
{% endhighlight %}
