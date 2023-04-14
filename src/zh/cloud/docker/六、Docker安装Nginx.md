---
title: 六、Docker安装Nginx
icon: nginx
order: 6
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Nginx
  - CI
  - CD
---

```bash
docker run -d -p 80:80 --name webserver nginx
```

常用命令：

删除容器： docker rm -f 容器 id<br />删除镜像： docker rmi -f 镜像名称
