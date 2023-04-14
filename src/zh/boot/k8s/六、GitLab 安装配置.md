---
title: 六、GitLab 安装配置
icon: symbol
order: 6
category:
  - 持续集成
tag:
  - 持续集成
  - K8S
  - 集群
  - CI
  - CD
---

&emsp;&emsp; GitLab 是可以部署在本地环境的 Git 项目仓库，这里介绍如何安装使用，在开发过程中我们将代码上传到本地仓库，然后 Jenkins 从仓库中拉取代码打包部署。

### 1. 下载需要的安装包，下载地址 [https://packages.gitlab.com/gitlab/gitlab-ce/](https://packages.gitlab.com/gitlab/gitlab-ce/) ，我们这里下载最新版 gitlab-ce-14.4.1-ce.0.el7.x86_64.rpm，当然在项目开发中需要根据自己的需求选择稳定版本

![](http://img.gitegg.com/cloud/docs/images/20211221102526.png#id=UBvqx&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 2. 点击需要安装的版本，会提示安装命令，按照上面提示的命令进行安装即可

```
curl -s https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash

sudo yum install gitlab-ce-14.4.1-ce.0.el7.x86_64
```

### 3. 配置并启动 Gitlab

```
gitlab-ctl reconfigure
```

### 4. 查看 Gitlab 状态

```
gitlab-ctl status
```

### 5. 设置初始登录密码

```
cd /opt/gitlab/bin

sudo ./gitlab-rails console

# 进入控制台之后执行

u=User.where(id:1).first

u.password='root1234'

u.password_confirmation='root1234'

u.save!

quit
```

### 6. 浏览器访问服务器地址，默认是 80 端口，所以直接访问即可，在登录界面输入我们上面设置的密码 root/root1234。

![](http://img.gitegg.com/cloud/docs/images/20211221102537.png#id=Line5&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102549.png#id=WAJwk&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 7. 设置界面为中文

User Settings ----> Preferences ----> Language ----> 简体中文 ----> 刷新界面

![](http://img.gitegg.com/cloud/docs/images/20211221102601.png#id=yG2TJ&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 8. Gitlab 常用命令

```
gitlab-ctl stop
gitlab-ctl start
gitlab-ctl restart
```
