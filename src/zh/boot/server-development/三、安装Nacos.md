---
title: 三、安装Nacos
icon: storage
order: 3
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Nacos
---

&emsp;&emsp;Nacos 是一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台，Nacos 致力于帮助您发现、配置和管理微服务。Nacos 提供了一组简单易用的特性集，帮助您快速实现动态服务发现、服务配置、服务元数据及流量管理。

<a name="d4dbcb4d"></a>

### 1. Nacos 发布地址：[https://github.com/alibaba/nacos/releases](https://github.com/alibaba/nacos/releases)，从里面选择需要的版本，这里选择 2.0.3 版本，下载地址为：[nacos-server-2.0.3.tar.gz](https://github.com/alibaba/nacos/releases/download/2.0.3/nacos-server-2.0.3.tar.gz)。

![](http://img.gitegg.com/cloud/docs/images/20220225171219.png#id=Hify8&originHeight=401&originWidth=914&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="8354f8a4"></a>

### 2. 下载完成后，上传到测试 Linux 服务器解压。（如果只想本地 windows 安装，可以下载 nacos-server-2.0.3.zip，解压后使用方法基本一致）

```
[root@localhost soft_home]# cd nacos
[root@localhost nacos]# ls
nacos-server-2.0.3.tar.gz
[root@localhost nacos]# tar -zxvf nacos-server-2.0.3.tar.gz
nacos/LICENSE
nacos/NOTICE
nacos/target/nacos-server.jar
nacos/conf/
nacos/conf/schema.sql
nacos/conf/nacos-mysql.sql
nacos/conf/application.properties.example
nacos/conf/nacos-logback.xml
nacos/conf/cluster.conf.example
nacos/conf/application.properties
nacos/bin/startup.sh
nacos/bin/startup.cmd
nacos/bin/shutdown.sh
nacos/bin/shutdown.cmd
[root@localhost nacos]# ls
nacos  nacos-server-1.4.0.tar.gz
[root@localhost nacos]# cd nacos
[root@localhost nacos]# ls
bin  conf  LICENSE  NOTICE  target
[root@localhost nacos]# cd bin
[root@localhost bin]# ls
shutdown.cmd  shutdown.sh  startup.cmd  startup.sh
[root@localhost bin]# pwd
/usr/local/nacos/nacos/bin
[root@localhost bin]#
```

<a name="5e97c6d9"></a>

### 3. 修改/nacos/conf/application.properties 配置文件的数据库连接，修改为自己实际的数据

```
#*************** Config Module Related Configurations ***************#
### If use MySQL as datasource:
spring.datasource.platform=mysql

### Count of DB:
db.num=1

### Connect URL of DB:
db.url.0=jdbc:mysql://127.0.0.1:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
db.user=nacos
db.password=nacos
```

<a name="68e4eb2d"></a>

### 4. 在数据库中刷入/nacos/conf 目录下的 nacos-mysql.sql 数据库脚本，如果需要其他配置或者了解使用方式可以访问官网，官网地址：https://nacos.io/zh-cn/docs/quick-start.html。

<a name="66db6790"></a>

### 5. 进入到 bin 目录下直接执行 sh startup.sh -m standalone。

```
[root@localhost bin]# sh startup.sh -m standalone
/usr/java/jdk1.8.0_77/bin/java  -server -Xms2g -Xmx2g -Xmn1g -XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=320m -XX:-OmitStackTraceInFastThrow -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/usr/local/nacos/nacos/logs/java_heapdump.hprof -XX:-UseLargePages -Dnacos.member.list= -Djava.ext.dirs=/usr/java/jdk1.8.0_77/jre/lib/ext:/usr/java/jdk1.8.0_77/lib/ext -Xloggc:/usr/local/nacos/nacos/logs/nacos_gc.log -verbose:gc -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=10 -XX:GCLogFileSize=100M -Dloader.path=/usr/local/nacos/nacos/plugins/health,/usr/local/nacos/nacos/plugins/cmdb -Dnacos.home=/usr/local/nacos/nacos -jar /usr/local/nacos/nacos/target/nacos-server.jar  --spring.config.location=file:/usr/local/nacos/nacos/conf/,classpath:/,classpath:/config/,file:./,file:./config/ --logging.config=/usr/local/nacos/nacos/conf/nacos-logback.xml --server.max-http-header-size=524288
nacos is starting with cluster
nacos is starting，you can check the /usr/local/nacos/nacos/logs/start.out
```

注意：如果是 windows 版本使用 startup.cmd 命令双击启动时，会报 java.net.UnknownHostException:jmenv.tbsite.net 错误，这是因为 nacos 默认使用集群模式启动的，这里可以修改 startup.cmd 里面 set MODE="standalone"解决。也可以在命令行启动时添加 -m standalone 参数。

<a name="0e9cd161"></a>

### 6、服务启动之后，可以访问 http://ip:8848/nacos 访问管理后台，默认用户名密码：nacos/nacos

![](http://img.gitegg.com/cloud/docs/images/Nacos%E7%99%BB%E5%BD%95%E9%A1%B5.png#id=A67qM&originHeight=969&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />![](http://img.gitegg.com/cloud/docs/images/20220225171532.png#id=AO1j4&originHeight=937&originWidth=1920&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
