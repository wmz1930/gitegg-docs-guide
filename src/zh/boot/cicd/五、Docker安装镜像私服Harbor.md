---
title: 五、Docker安装镜像私服Harbor
icon: type
order: 5
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Harbor
  - CI
  - CD
---

### 1. 下载地址：https://github.com/goharbor/harbor/releases选择合适的版本进行下载

### 2. 上传到 Linux 服务器

### 3. 解压

```
tar -zxf harbor-offline-installer-v2.2.4.tgz
```

### 4. 配置

```
cd harbor

mv harbor.yml.tmpl harbor.yml

vi harbor.yml
```

将 hostname 改为当前服务器地址，注释掉 https 配置。

```
 ......

# The IP address or hostname to access admin UI and registry service.
# DO NOT use localhost or 127.0.0.1, because Harbor needs to be accessed by external clients.
hostname: 172.16.20.175

# http related config
http:
  # port for http, default is 80. If https enabled, this port will redirect to https port
  port: 80

# https related config
#https:
  # https port for harbor, default is 443
 # port: 443
  # The path of cert and key files for nginx
 # certificate: /your/certificate/path
 # private_key: /your/private/key/path

 ......
```

### 5. 执行安装命令

```

mkdir /var/log/harbor/

./install.sh
```

### 6. 查看安装是否成功

```
[root@localhost harbor]# docker ps
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS                             PORTS                                   NAMES
de1b702759e7        goharbor/harbor-jobservice:v2.2.4    "/harbor/entrypoint.…"   13 seconds ago      Up 9 seconds (health: starting)                                            harbor-jobservice
55b465d07157        goharbor/nginx-photon:v2.2.4         "nginx -g 'daemon of…"   13 seconds ago      Up 9 seconds (health: starting)    0.0.0.0:80->8080/tcp, :::80->8080/tcp   nginx
d52f5557fa73        goharbor/harbor-core:v2.2.4          "/harbor/entrypoint.…"   13 seconds ago      Up 10 seconds (health: starting)                                           harbor-core
4ba09aded494        goharbor/harbor-db:v2.2.4            "/docker-entrypoint.…"   13 seconds ago      Up 11 seconds (health: starting)                                           harbor-db
647f6f46e029        goharbor/harbor-portal:v2.2.4        "nginx -g 'daemon of…"   13 seconds ago      Up 11 seconds (health: starting)                                           harbor-portal
70251c4e234f        goharbor/redis-photon:v2.2.4         "redis-server /etc/r…"   13 seconds ago      Up 11 seconds (health: starting)                                           redis
21a5c408afff        goharbor/harbor-registryctl:v2.2.4   "/home/harbor/start.…"   13 seconds ago      Up 11 seconds (health: starting)                                           registryctl
b0937800f88b        goharbor/registry-photon:v2.2.4      "/home/harbor/entryp…"   13 seconds ago      Up 11 seconds (health: starting)                                           registry
d899e377e02b        goharbor/harbor-log:v2.2.4           "/bin/sh -c /usr/loc…"   13 seconds ago      Up 12 seconds (health: starting)   127.0.0.1:1514->10514/tcp               harbor-log
```

### 7. harbor 的启动停止命令

```
docker-compose down   #停止

docker-compose up -d  #启动
```

### 8. 访问 harbor 管理台地址，上面配置的 hostname： [http://172.16.20.175/](http://172.16.20.175/) ，默认用户名/密码： admin/Harbor12345
