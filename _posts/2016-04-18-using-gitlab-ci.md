---
layout: post
title:  使用Gitlab CI & Docker搭建CI环境
date:   2016-03-18
rmdtext: 想要方便的增加Cron Job
rmdurl: /2016/01/14/use-whenever.html
---

本文介绍如何使用Gitlab CI和Docker代价一套持续集成环境，虽然并不完美，但是十分简单好用。

### 安装gitlab runner

整个方案基于Gitlab CI，需要安装Gitlab 8.0以上版本，然后CI模块也包含在其中。当然，我们也需要将代码托管在gitlab上。

接下来我们需要在一台构建机器上安装Runner。

<img src="/images/posts/gitlab-ci-runner.jpg"/>

你可以有多个runner，它们将负责编译、测试、打包和发布。我们将代码push到gitlab后，gitlab就会触发Runner构建我们的项目，并通知Gitlab CI Server 结果。
我们使用Docker一键安装runner。

{% highlight Bash shell %}
docker run -d --name gitlab-runner --restart always \
-v /var/run/docker.sock:/var/run/docker.sock \
-v /srv/gitlab-runner/config:/etc/gitlab-runner \
gitlab/gitlab-runner:latest
{% endhighlight %}

查看一下是否启动成功

{% highlight Bash shell %}
docker ps
{% endhighlight %}

### 在Gitlab CI Server中注册Runner

只有通过认证的Runner才可以连接到Gitlab CI Server上，所以需要一个注册过程。我们接着运行

{% highlight Bash shell %}
docker exec -it gitlab-runner gitlab-runner register
{% endhighlight %}

然后它会询问一些必要的认证信息和配置信息，以下是个例子

{% highlight Bash shell %}
Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/ci )
https://your-gitlab-host/ci
Please enter the gitlab-ci token for this runner
xxx
Please enter the gitlab-ci description for this runner
my-runner
INFO[0034] fcf5c619 Registering runner... succeeded
Please enter the executor: shell, docker, docker-ssh, ssh?
docker
Please enter the Docker image (eg. ruby:2.1):
maven:3-jdk-7
INFO[0037] Runner registered successfully. Feel free to start it, but if it's
running already the config should be automatically reloaded!
{% endhighlight %}

至于那个Token，你可以在管理界面找到，如下图

<img src="/images/posts/gitlab-runner-token.png"/>

如果在gitlab的管理界面的Runner tab中可以看到这个Runner，表明安装成功。在Runner列表里点击edit，对你要构建的项目启用这个Runner，进入下一步。

### 定义项目的构建流程

项目的构建流程是由项目根目录的gitlab-ci.yml文件控制的，关于详细的配置文档可以查看[这里](http://doc.gitlab.com/ee/ci/yaml/README.html),以下是一个简单的Maven项目的例子

我们首先试一下运行单元测试

{% highlight YAML %}
image: maven:3-jdk-8

test:
  stage: test
  script: "mvn test"
{% endhighlight %}

别忘了在项目设置中启用自动构建

<img src="/images/posts/gitlab-enable-ci.png"/>

将代码push到gitlab，在项目的Builds tab中查看构建过程

### 提升构建速度

在上一步中，实际上Gitlab Runner启动了一个Docker container来运行你的构建，配置中的maven:3-jdk-8实际就是docker image.每次构建因为都是在独立的container里，
maven的 .m2文件并不会被多次构建公用，所以每次maven都需要重新从maven库中下载依赖的jar包，这其实是没必要的。

由于我们在docker container 里构建项目，我们可以使用docker 的volume将.m2文件在多个container之间共享。

另外，runner每次都会去docker hub上拉取依赖的image，这也是没有必要的，我们可以复用之前的。

由此我们需要做一些变更，我们在Runner的服务器上打开/srv/gitlab-runner/config/config.toml文件。将maven .m2目录加到volumes中，并增加镜像拉取规则。如下

{% highlight YAML %}
concurrent = 2

[[runners]]
  ...
  [runners.docker]
    ...
    volumes = ["/cache","/root/m2:/root/.m2"]
    pull_policy = "if-not-present"
  ...
{% endhighlight %}

重启runner

{% highlight bash shell %}
docker restart gitlab-runner
{% endhighlight %}

之后的构建将会快一些了

### 发布项目

有时我们希望构建后项目可以自动发布，可以通过修改gitlab-ci.yml来实现。我使用的过程是

1. 将构建结果scp到测试服务器
2. 在测试服务器上运行启动脚本

为了让runner服务器可以访问测试服务器，我们需要加入ssh private key信息。但是私钥比较敏感，需要使用gitlab注入环境变量实现。打开项目的设置界面，在variable tab
中就可以加入变量了。将私钥作为变量加入，并取名为SSH_PRIVATE_KEY. 同时将公钥加入测试机器。

<img src="/images/posts/gitlab-add-variable.png"/>

为了在构建项目时引入私钥，我们需要加入一段before_script。 修改后的gitlab-ci.yml如下

{% highlight YAML %}
image: maven:3-jdk-8

before_script:
  - 'which ssh-agent || ( apt-get update -y && apt-get install openssh-client -y )'
  - eval $(ssh-agent -s)
  - ssh-add <(echo "$SSH_PRIVATE_KEY")
  - mkdir -p ~/.ssh
  - '[[ -f /.dockerinit ]] && echo -e "Host *\n\tStrictHostKeyChecking no\n\n" > ~/.ssh/config'

stages:
  - test
  - deploy

test:
  stage: test
  script: "mvn test"

staging-deploy:
  stage: deploy
  script: >
    mvn package -Dmaven.test.skip=true &&
    scp target/package.jar user@remote-server:/jar-path/$CI_BUILD_ID.jar &&
    ssh user@remote-server "deploy_script.sh"
{% endhighlight %}

### 自动测试&手动发布

有时候我们不希望每次push都引发测试环境重新部署，可以在staging-deploy这个job中加入一个对构建参数的判断，如下

{% highlight YAML %}
staging-deploy:
  stage: deploy
  script: >
    if [ -n "${UPLOAD_TO_SERVER}" ]; then
    mvn package -Dmaven.test.skip=true &&
    scp target/package.jar user@remote-server:/jar-path/$CI_BUILD_ID.jar &&
    ssh user@remote-server "deploy_script.sh"
    ; fi
{% endhighlight %}

当需要重新部署时执行如下shell

{% highlight Bash shell %}
#!/usr/bin/env bash

curl -X POST \
  -F token=XXX \
  -F ref=master http://your-gitlab-host/api/v3/projects/1/trigger/builds \
  -F "variables[UPLOAD_TO_SERVER]=true"
{% endhighlight %}

上面的token可以在项目的triggers tab中找到

### 总结

以上是我们团队进行持续集成的方案，适合我们这样的小团队，如果你需要的也仅仅是一个简易的方案，可以考虑这个。整个环境的搭建可以在15-30分钟之内完成
