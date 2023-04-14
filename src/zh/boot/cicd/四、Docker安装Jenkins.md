---
title: 四、Docker安装Jenkins
icon: merge
order: 4
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Jenkins
  - CI
  - CD
---

## 一、安装

### 1. 拉取 jenkins 镜像

`docker pull jenkins/jenkins`

### 2. 创建 jenkins 工作目录

`mkdir /home/jenkins  `

### 3. 给工作目录赋权限

`chown -R 1000:1000 jenkins/ `

### 4、启动 jenkins

`sudo docker run -itd -p 8080:8080 -p 50000:50000 --name jenkins --privileged=true -v /home/jenkins_home:/var/jenkins_home jenkins`

### 5、查看运行日志

`docker logs -f jenkins`

### 6、查看初始密码，并登录 jenkins

`cat /home/jenkins/secrets/initialAdminPassword   `

### 7、进入 jenkins 容器

` docker exec -it jenkins /bin/bash`

## 二、常见问题

- 如果一直卡在启动页面

a. 关闭防火墙

```bash
systemctl stop firewalld.service
systemctl disable firewalld.service
systemctl status firewalld.service
```

b. 重启 docker，重启 jenkins

```bash
systemctl restart docker
docker start jenkins
```

- 安装插件下载慢

a. 把 "connectionCheckUrl":"[http://www.google.com/"](http://www.google.com/") 改为 "connectionCheckUrl":"[http://www.baidu.com/"](http://www.baidu.com/")

```bash
systemctl restart docker
docker start jenkins
```

b. 把：[http://updates.jenkins-ci.org/update-center.json](http://updates.jenkins-ci.org/update-center.json)换成：[http://mirror.esuni.jp/jenkins/updates/update-center.json](http://mirror.esuni.jp/jenkins/updates/update-center.json)

```bash
vi /home/jenkins/hudson.model.UpdateCenter.xml
```

[](http://mirror.esuni.jp/jenkins/updates/update-center.json)
