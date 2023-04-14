---
title: 三、Docker安装GitLab
icon: slides
order: 3
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - GitLab
  - CI
  - CD
---

### 1. gitlab 镜像拉取，gitlab-ce 为稳定版本，后面不填写版本则默认 pull 最新 latest 版本

```bash
$ docker pull gitlab/gitlab-ce
```

### 2. 运行 gitlab 镜像

```bash
$ docker run -d  -p 443:443 -p 80:80 -p 222:22 --name gitlab --restart always -v /data/gitlab/config:/etc/gitlab -v /data/gitlab/logs:/var/log/gitlab -v /data/gitlab/data:/var/opt/gitlab gitlab/gitlab-ce
```

### 3. 按上面的方式，gitlab 容器运行没问题，但在 gitlab 上创建项目的时候，生成项目的 URL 访问地址是按容器的 hostname 来生成的，也就是容器的 id。作为 gitlab 服务器，我们需要一个固定的 URL 访问地址，于是需要配置 gitlab.rb（宿主机路径：/data/gitlab/config/gitlab.rb），gitlab.rb 文件内容默认全是注释：

```bash
# gitlab.rb文件内容默认全是注释
$ vi /data/gitlab/config/gitlab.rb

# 配置http协议所使用的访问地址,不加端口号默认为80
external_url 'http://192.168.10.106'

# 配置ssh协议所使用的访问地址和端口
gitlab_rails['gitlab_ssh_host'] = '192.168.10.106'

# 此端口是run时22端口映射的222端口
gitlab_rails['gitlab_shell_ssh_port'] = 222

#保存配置文件并退出
:wq
```

### 4. 创建一个项目，第一次进入要输入新的 root 用户密码，设置好之后确定就行，默认密码：root/root1234

**常见问题：**

断电重启的异常：

1、进入容器<br />`docker exec -ti gitlab /bin/bash`<br />2、重启命令<br />`gitlab-ctl restart`<br />3、查看状态<br />`gitlab-ctl status`<br />4、给工作目录赋权限<br />`setfacl -R -m u:docker:rwx /data`
