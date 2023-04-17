---
title: 五、安装Seata
icon: mount
order: 5
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Seata
---

<a name="a8abe51a"></a>

### 1. 我们将服务安装到 CentOS 环境上，所以这里我们下载 tar.gz 版本,下载地址:[https://github.com/seata/seata/releases](https://github.com/seata/seata/releases)

![](https://cdn.gitegg.com/cloud/docs/images/seata-server.png#id=MIxEN&originHeight=692&originWidth=1059&originalType=binary&ratio=1&status=done&style=none)

<a name="021f8d1a"></a>

### 2. 上传到 CentOS 服务器，执行解压命令

```
tar -zxvf seata-server-1.4.1.tar.gz
```

<a name="8b73f590"></a>

### 3. 下载 Seata 需要的 SQL 脚本，新建 Seata 数据库并将需要使用的数据库脚本 seata-1.4.1\seata-1.4.1\script\server\db\mysql.sql 刷进去

![](https://cdn.gitegg.com/cloud/docs/images/seata%E6%95%B0%E6%8D%AE%E5%BA%93.png#id=uG8be&originHeight=184&originWidth=458&originalType=binary&ratio=1&status=done&style=none)

<a name="a0a07dd7"></a>

### 4. 修改 Seata 配置文件，将 seata 服务端的注册中心和配置中心设置为 Nacos

```
vi /bigdata/soft_home/seata/conf/registry.conf
```

```
registry {
  # file 、nacos 、eureka、redis、zk、consul、etcd3、sofa
  type = "nacos"
  loadBalance = "RandomLoadBalance"
  loadBalanceVirtualNodes = 10

  nacos {
    application = "seata-server"
    serverAddr = "127.0.0.1:8848"
    group = "SEATA_GROUP"
    namespace = ""
    cluster = "default"
    username = "nacos"
    password = "nacos"
  }
  eureka {
    serviceUrl = "http://localhost:8761/eureka"
    application = "default"
    weight = "1"
  }
  redis {
    serverAddr = "localhost:6379"
    db = 0
    password = ""
    cluster = "default"
    timeout = 0
  }
  zk {
    cluster = "default"
    serverAddr = "127.0.0.1:2181"
    sessionTimeout = 6000
    connectTimeout = 2000
    username = ""
    password = ""
  }
  consul {
    cluster = "default"
    serverAddr = "127.0.0.1:8500"
  }
  etcd3 {
    cluster = "default"
    serverAddr = "http://localhost:2379"
  }
  sofa {
    serverAddr = "127.0.0.1:9603"
    application = "default"
    region = "DEFAULT_ZONE"
    datacenter = "DefaultDataCenter"
    cluster = "default"
    group = "SEATA_GROUP"
    addressWaitTime = "3000"
  }
  file {
    name = "file.conf"
  }
}

config {
  # file、nacos 、apollo、zk、consul、etcd3
  type = "nacos"

  nacos {
    serverAddr = "127.0.0.1:8848"
    namespace = ""
    group = "SEATA_GROUP"
    username = "nacos"
    password = "nacos"
  }
  consul {
    serverAddr = "127.0.0.1:8500"
  }
  apollo {
    appId = "seata-server"
    apolloMeta = "http://192.168.1.204:8801"
    namespace = "application"
    apolloAccesskeySecret = ""
  }
  zk {
    serverAddr = "127.0.0.1:2181"
    sessionTimeout = 6000
    connectTimeout = 2000
    username = ""
    password = ""
  }
  etcd3 {
    serverAddr = "http://localhost:2379"
  }
  file {
    name = "file.conf"
  }
}
```

<a name="a0323019"></a>

### 5. 在 Nacos 添加 Seata 配置文件，修改 script/config-center/config.txt，将 script 目录上传到 CentOS 服务器，执行 script/config-center/nacos/nacos-config.sh 命令

```
service.vgroupMapping.gitegg_seata_tx_group=default

service.default.grouplist=127.0.0.1:8091

store.mode=db

store.db.url=jdbc:mysql://127.0.0.1:3306/seata?useUnicode=true
store.db.user=root
store.db.password=root
```

```
chmod 777 nacos-config.sh

sh nacos-config.sh -h 127.0.0.1 -p 8848
```

![](https://cdn.gitegg.com/cloud/docs/images/%E8%AE%BE%E7%BD%AE%E6%88%90%E5%8A%9F.png#id=byAKj&originHeight=145&originWidth=589&originalType=binary&ratio=1&status=done&style=none)

<a name="4c954093"></a>

### 6. 在 CentOS 上进去到 Seata 安装目录的 bin 目录执行命令，启动 Seata 服务端

```
nohup ./seata-server.sh -h 127.0.0.1 -p 8091 >log.out 2>1 &
```

######如果服务器有多网卡，存在多个 ip 地址，-h 后面一定要加可以访问的 ip 地址

<a name="47c268c3"></a>

### 7. 在 Nacos 上可以看到配置文件和服务已经注册成功

![](https://cdn.gitegg.com/cloud/docs/images/Seata%E9%85%8D%E7%BD%AE.png#id=cDShP&originHeight=392&originWidth=1615&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/Seata%E6%9C%8D%E5%8A%A1.png#id=a9Bc4&originHeight=421&originWidth=1511&originalType=binary&ratio=1&status=done&style=none)
