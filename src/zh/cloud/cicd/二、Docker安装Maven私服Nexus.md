---
title: 二、Docker安装Maven私服Nexus
icon: snow
order: 2
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Nexus
  - CI
  - CD
---

**本文是关于通过 Docker 进行安装部署 Nexus3 私服的快速入门和简单使用案例。**

## 一、安装

### 1. 通过 docker 获取最新版本的 nexus3 镜像

`docker pull sonatype/nexus3`<br />创建 docker 镜像到宿主机的磁盘映射目录<br />Linux:<br />`mkdir -p /home/nexus/data`<br />`chmod 777 -R /home/nexus/data`<br />Windows:<br />手动创建任意文件夹，如：<br />`F:\nexus3\data`

### 2. 启动镜像

通过默认参数值启动镜像<br />Linux:<br />`docker run -d --name nexus3 -p 8033:8081 --restart always -v /home/nexus/data:/nexus-data sonatype/nexus3`<br />Windows:<br />`docker run -d --name nexus3 -p 8033:8081 --restart always -v F:/nexus3/data:/nexus-data sonatype/nexus3`

附带说明（非必要操作，新手可以忽略该步骤）：<br />注：根据需要可以自定义配置参数运行 Nexus 镜像程序<br />镜像中的默认私服数据持久化目录为/nexus-data<br />该目录可以通过-Djava.util.prefs.userRoot=${NEXUS_DATA}/javaprefs 参数进行配置， 将/nexus-data路径改变为${NEXUS_DATA}/javaprefs<br />通过 NEXUS_CONTEXT 变量控制 Nexus Context Path，默认值为 `NEXUS_CONTEXT=/` <br />可以按需修改，示例为：`NEXUS_CONTEXT=nexus`<br />通过`-Xms2703m -Xmx2703m -XX:MaxDirectMemorySize=2703m` 设置相关服务运行内存<br />示例：<br />`docker run -d -p 8081:8081 --name nexus3 -e INSTALL4J_ADD_VM_PARAMS="-Xms2703m -Xmx2703m -XX:MaxDirectMemorySize=2703m -Djava.util.prefs.userRoot=/nexus-data2" sonatype/nexus3`

### 3. 获取临时密码进行首次登录，然后默认修改成永久密码

方式（一）通过 docker 命令进入容器获取默认账号 admin 对应的临时登录密码
<br />（1）查找对应容器 id<br />`docker ps -a`
<br /> (2) 进入容器终端命令行<br />`docker exec -it <容器id> /bin/bash`
<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416231250.png)
<br />（3）获取对应目录文件下的 admin 账号的临时密码
<br />`cat /nexus-data/admin.password`
<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416231420.png)
<br />方式（二）直接到对应镜像映射的磁盘目录上找到对应 admin.password 文件，以文本方式打开查看 admin 账号的临时密码
<br />如本文中将容器的/nexus-data 目录映射到了宿主机磁盘的 F:\nexus3\data 目录，然后以文本文件方式打开 admin.password 查看对应临时密码
<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232342.png)

### 4. 输入对应的 Nexus3 私服部署地址进行访问，然后进行修改默认账号 admin 的临时密码。

![](https://cdn.gitegg.com/cloud/docs/images/20230416232421.png)

<br />通过 admin 账号和临时密码进行登录
<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232518.png)

### 5. 初次登录成功后，弹出提示操作，根据默认提示，进入到第二步修改 admin 账号的密码为永久

![](https://cdn.gitegg.com/cloud/docs/images/20230416232553.png)
<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232623.png)
<br />最后，密码修改完成，可以点击右上角 sign out 进行退出重新登录

## 二、以下为正式使用 Nexus3 私服的过程

### 1. 创建仓库

![](https://cdn.gitegg.com/cloud/docs/images/20230416232650.png)

### 2. 选择要创建的仓库类型

![](https://cdn.gitegg.com/cloud/docs/images/20230416232721.png)

### 3. 对要创建的仓库进行属性

![](https://cdn.gitegg.com/cloud/docs/images/20230416232746.png)
### 4. 将刚刚创建的仓库添加到公共分组

<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232806.png)

<br />此处需要注意调整组内不同节点的顺序，对应 jar 包的加载会根据顺序从上到下依次加载，因此建议，私服排最上，公共仓库排最底下。

<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232822.png)

### 5. 通过管理面板手动上传 jar 包到私服上

![](https://cdn.gitegg.com/cloud/docs/images/20230416232846.png)

<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232915.png)

<br />上传成功后，在 browse 界面查看

<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416232940.png)

## 三、以下为在 IDEA 工具下通过 Maven 自动编译打包将 jar 包自动上传到 Nexus 私服的过程

### 1. 配置 Maven 的 Settings.xml 文件，添加对应私服的仓库和对应的账号密码

进入 maven 的安装目录 D:\Program Files\apache-maven-3.8.2\conf 中找到 Settings.xml 进行编辑配置

<br />![](https://cdn.gitegg.com/cloud/docs/images/20230416233020.png)

### 2. 在 servers 标签中添加私服的账号密码，在 mirrors 标签中配置私服的类型和地址

```xml
<servers>
  <server>
    <id>gitegg-release</id>
    <username>admin</username>
    <password>admin</password>
  </server>
  <server>
    <id>gitegg-snapshots</id>
    <username>admin</username>
    <password>admin</password>
  </server>
</servers>

<mirrors>
  <mirror>
    <id>alimaven</id>
    <name>aliyun maven</name>
    <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
    <mirrorOf>central</mirrorOf>
  </mirror>
  <mirror>
    <id>nexus-gitegg</id>
    <url>http://localhost:8033/repository/maven-public/</url>
    <mirrorOf>*</mirrorOf>
  </mirror>
</mirrors>
```

### 3. 在项目工程的根 pom.xml 文件中进行发布配置

```xml
<project>
  <!--......-->

  <distributionManagement>
    <snapshotRepository>
      <id>gitegg-snapshots</id>
      <url>http://localhost:8033/repository/gitegg-snapshots/</url>
    </snapshotRepository>
    <repository>
      <id>gitegg-release</id>
      <url>http://localhost:8033/repository/gitegg-release/</url>
    </repository>
  </distributionManagement>
</project>
```

### 4. 最后通过 IDEA 下 Maven 工具的相关工程 Lifecycle 下的 deploy 选项进行发布到私服

![](https://cdn.gitegg.com/cloud/docs/images/20230416233058.png)

注意：Maven 会自动检测 version 版本号的命名，根据是否包含 SNAPSHOT 关键字进行匹配识别。
<br />当发布 SNAPSHOT 版本时，必须在版本号末尾添加-SNAPSHOT 后缀，然后自动发布到 snapshotRepository 配置节点，示例：2.3.12-SNAPSHOT。
<br />当发布 RELEASE 版本时，只要不带 SNAPSHOT 关键字的均识别为 RELEASE 版本,自动发布到 repository 节点，根据规范建议在 RELEASE 版本中添加.RELEASE 后缀，如 2.3.12.RELEASE。

### 5. 发布成功后，可在 Browse 对应仓库或者分组中查看到。

![](https://cdn.gitegg.com/cloud/docs/images/20230416233121.png)