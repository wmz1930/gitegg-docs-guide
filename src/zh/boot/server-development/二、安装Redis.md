---
title: 二、安装Redis
icon: workingDirectory
order: 2
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Redis
---

下面是在 CentOS7 中安装 Redis 的操作步骤，在命令行执行以下命令：

<a name="81111871"></a>

### 1. 下载并解压 Redis 安装包

```
wget http://download.redis.io/releases/redis-5.0.5.tar.gz

cd /opt/software/

tar zxf redis-5.0.5.tar.gz -C /usr/local/src
```

<a name="d21a822c"></a>

### 2. 编译并安装 Redis

```
cd /usr/local/src/redis-5.0.5

make && make install

ln -s /usr/local/src/redis-5.0.5 /usr/local/redis
```

<a name="0deb0b92"></a>

### 3. 修改 Redis 配置文件

```
vi /usr/local/redis/redis.conf
#修改内容如下：
daemonize yes                           #开启后台运行
timeout 120                                #超时时间
bind 0.0.0.0                                #任何地址IP都可以登录redis
requirepass 123456          #redis密码123456
```

<a name="7971e1de"></a>

### 4. 启动 Redis

```
cd /usr/local/redis/src
./redis-server /usr/local/redis/redis.conf
```

<a name="cb298dc5"></a>

### 5. 测试安装配置是否成功

```
redis-cli -h 127.0.0.1 -p 6379 -a 123456

127.0.0.1:6379> KEYS * (empty list or set)
127.0.0.1:6379> set user ray
OK
127.0.0.1:6379> KEYS *
1) "user"
```

**常见问题：**

**redis 不能远程连接时，可能是防火墙的问题，关闭防火墙或者开放对应的 redis 端口即可**
