---
title: 一、Docker安装Mysql
icon: mysql
order: 1
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Mysql
  - CI
  - CD
---

### 1. 安装命令：

```bash
docker pull mysql

docker run -p 3306:3306 --name mymysql -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql
```

参数说明：

- -p 3306:3306：将容器的 3306 端口映射到主机的 3306 端口。
- -v -v $PWD/conf:/etc/mysql/conf.d：将主机当前目录下的 conf/my.cnf 挂载到容器的 /etc/mysql/my.cnf。
- -v $PWD/logs:/logs：将主机当前目录下的 logs 目录挂载到容器的 /logs。
- -v $PWD/data:/var/lib/mysql ：将主机当前目录下的 data 目录挂载到容器的 /var/lib/mysql 。
- -e MYSQL_ROOT_PASSWORD=123456：初始化 root 用户的密码。

### 2. 查看 mysql 日志命令：

```bash
docker logs mymysql
```

### 3. 初始化远程连接操作：

安装完成后，用 navicat for mysql 连接 mysql 发现报错：Client does not support authentication protocol requested by server。。。

```bash
#f89d302e704f 为容器id
docker exec -it f89d302e704f /bin/bash

mysql -uroot -p


mysql> GRANT ALL ON *.* TO 'root'@'%';

mysql> flush privileges;

mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password' PASSWORD EXPIRE NEVER;

mysql> ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'root';

mysql> flush privileges;
```

### 4. 启动命令：

```bash
docker run -p 3307:3306 --name mysql \
-v /data/docker/mysql/conf:/etc/mysql \
-v /data/docker/mysql/logs:/var/log/mysql \
-v /data/docker/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=root --privileged=true \
-d mysql:5.7.23
```
