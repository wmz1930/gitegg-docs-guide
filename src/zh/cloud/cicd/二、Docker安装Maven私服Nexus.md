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

方式（一）通过 docker 命令进入容器获取默认账号 admin 对应的临时登录密码<br />（1）查找对应容器 id<br />`docker ps -a`<br /> (2) 进入容器终端命令行<br />`docker exec -it <容器id> /bin/bash`<br />![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656005405776-92ec38b0-3987-477a-899f-8c27bf711f45.png#clientId=uffbeb2ac-353f-4&from=paste&height=529&id=u7abfaae5&name=Image.png&originHeight=476&originWidth=1704&originalType=binary&ratio=1&rotation=0&showTitle=false&size=52808&status=done&style=none&taskId=u82a7bd1d-4063-466a-87c7-abd34d90c35&title=&width=1893.3333834895395)<br />（3）获取对应目录文件下的 admin 账号的临时密码<br />`cat /nexus-data/admin.password`<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656005708628-6564fd3a-04e2-4b2f-8d75-6f6e685dfa3e.png#clientId=uffbeb2ac-353f-4&from=paste&height=98&id=u6c7368e6&name=image.png&originHeight=88&originWidth=427&originalType=binary&ratio=1&rotation=0&showTitle=false&size=4126&status=done&style=none&taskId=ub1060036-da74-4a6d-bf2c-3b4931d18b2&title=&width=474.44445701293034)<br />方式（二）直接到对应镜像映射的磁盘目录上找到对应 admin.password 文件，以文本方式打开查看 admin 账号的临时密码<br />如本文中将容器的/nexus-data 目录映射到了宿主机磁盘的 F:\nexus3\data 目录，然后以文本文件方式打开 admin.password 查看对应临时密码<br />![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656005861653-18b2360b-8490-4182-ba0e-a4e920ab0730.png#clientId=uffbeb2ac-353f-4&from=paste&height=770&id=ucf6f5935&name=Image.png&originHeight=693&originWidth=1212&originalType=binary&ratio=1&rotation=0&showTitle=false&size=82500&status=done&style=none&taskId=u17cb4d99-51fc-47db-b53d-930c74d2114&title=&width=1346.6667023411512)

### 4. 输入对应的 Nexus3 私服部署地址进行访问，然后进行修改默认账号 admin 的临时密码。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006154646-538f9afa-4ca4-43fc-bee8-5ff4039dce6a.png#clientId=uffbeb2ac-353f-4&from=paste&height=374&id=u064ca2c1&name=image.png&originHeight=337&originWidth=1021&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30641&status=done&style=none&taskId=u62bbaaa9-e9fe-4ec6-9171-a5e238180e9&title=&width=1134.4444744969599)<br />通过 admin 账号和临时密码进行登录<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006226276-8e9ec873-23ab-44fb-bfa1-c46816623710.png#clientId=uffbeb2ac-353f-4&from=paste&height=696&id=u2719f01d&name=image.png&originHeight=626&originWidth=1021&originalType=binary&ratio=1&rotation=0&showTitle=false&size=38042&status=done&style=none&taskId=u840cd47e-4193-4dec-bcf4-2fe0ddfa53f&title=&width=1134.4444744969599)

### 5. 初次登录成功后，弹出提示操作，根据默认提示，进入到第二步修改 admin 账号的密码为永久

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006339052-d52cf196-684d-4e6d-88ae-b3e40faf5097.png#clientId=uffbeb2ac-353f-4&from=paste&height=699&id=uca9912d7&name=image.png&originHeight=629&originWidth=1021&originalType=binary&ratio=1&rotation=0&showTitle=false&size=68700&status=done&style=none&taskId=ucb4e5aa0-c14c-4237-b10c-ab21b6e34e7&title=&width=1134.4444744969599)<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006416208-e83a1fa8-ff57-45e0-97eb-93b250122b8f.png#clientId=uffbeb2ac-353f-4&from=paste&height=696&id=u104da1ed&name=image.png&originHeight=626&originWidth=1021&originalType=binary&ratio=1&rotation=0&showTitle=false&size=80601&status=done&style=none&taskId=u86360965-36ad-4627-9777-f194b342ae6&title=&width=1134.4444744969599)<br />最后，密码修改完成，可以点击右上角 sign out 进行退出重新登录

## 二、以下为正式使用 Nexus3 私服的过程

### 1. 创建仓库

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006620870-2b9c2c59-4040-4f0c-992d-5c85247ad8d8.png#clientId=uffbeb2ac-353f-4&from=paste&height=734&id=u24fe801a&name=Image.png&originHeight=661&originWidth=956&originalType=binary&ratio=1&rotation=0&showTitle=false&size=65342&status=done&style=none&taskId=ud51c4c6f-4cb8-46c5-9c30-25f8df41520&title=&width=1062.2222503615021)

### 2. 选择要创建的仓库类型

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006646291-b8f114bf-4e6f-43c7-99e5-abceaaefcba0.png#clientId=uffbeb2ac-353f-4&from=paste&height=732&id=u8b0be59e&name=Image.png&originHeight=659&originWidth=956&originalType=binary&ratio=1&rotation=0&showTitle=false&size=68942&status=done&style=none&taskId=u358e16fe-00a3-4d75-9778-31fe23c2b79&title=&width=1062.2222503615021)

### 3. 对要创建的仓库进行属性

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006686017-2e44e696-fba8-4e5f-a932-ea9f6b50a01d.png#clientId=uffbeb2ac-353f-4&from=paste&height=1034&id=u1e20a466&name=Image.png&originHeight=931&originWidth=898&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59724&status=done&style=none&taskId=u1a2f48ec-bec3-4be4-b3a7-874ab7862e5&title=&width=997.7778042098629)

### 4. 将刚刚创建的仓库添加到公共分组

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006730038-4bac7cd2-32e5-45bb-861c-6c8bc241353a.png#clientId=uffbeb2ac-353f-4&from=paste&height=734&id=u693276a8&name=Image.png&originHeight=661&originWidth=956&originalType=binary&ratio=1&rotation=0&showTitle=false&size=60342&status=done&style=none&taskId=uf833ee8e-3091-4156-8072-823965c90ef&title=&width=1062.2222503615021)<br />此处需要注意调整组内不同节点的顺序，对应 jar 包的加载会根据顺序从上到下依次加载，因此建议，私服排最上，公共仓库排最底下。<br />![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006744675-8a69f23b-5576-4c71-8f9d-a8996d926562.png#clientId=uffbeb2ac-353f-4&from=paste&height=1042&id=uddead8ef&name=Image.png&originHeight=938&originWidth=1026&originalType=binary&ratio=1&rotation=0&showTitle=false&size=67885&status=done&style=none&taskId=u5dc8bf7c-b74a-4482-a510-ee09e0e94fd&title=&width=1140.0000301996874)

### 5. 通过管理面板手动上传 jar 包到私服上

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006837725-a6a293fb-dc3c-4a09-9872-9a9ea63c0800.png#clientId=uffbeb2ac-353f-4&from=paste&height=611&id=ua530bfcf&name=Image.png&originHeight=550&originWidth=956&originalType=binary&ratio=1&rotation=0&showTitle=false&size=54809&status=done&style=none&taskId=ub2b93d4d-039b-4020-a2e4-907976c39b7&title=&width=1062.2222503615021)<br />![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006845879-7bbb8dfa-344d-46ce-ab9a-56c5346b8fa7.png#clientId=uffbeb2ac-353f-4&from=paste&height=616&id=ubdf06de1&name=Image.png&originHeight=554&originWidth=961&originalType=binary&ratio=1&rotation=0&showTitle=false&size=30490&status=done&style=none&taskId=ubd91c43a-f50b-4952-be3d-8d03a006d6c&title=&width=1067.7778060642297)<br />上传成功后，在 browse 界面查看<br />![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656006856480-a4338437-e700-49d5-8899-71adde762a71.png#clientId=uffbeb2ac-353f-4&from=paste&height=478&id=uaf1fd316&name=Image.png&originHeight=430&originWidth=710&originalType=binary&ratio=1&rotation=0&showTitle=false&size=26690&status=done&style=none&taskId=u5fe29eac-3554-427b-a863-32772560789&title=&width=788.8889097873081)

## 三、以下为在 IDEA 工具下通过 Maven 自动编译打包将 jar 包自动上传到 Nexus 私服的过程

### 1. 配置 Maven 的 Settings.xml 文件，添加对应私服的仓库和对应的账号密码

进入 maven 的安装目录 D:\Program Files\apache-maven-3.8.2\conf 中找到 Settings.xml 进行编辑配置<br />![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656007218152-3f230ee6-14a7-43b0-958f-ca94522a2d94.png#clientId=uffbeb2ac-353f-4&from=paste&height=259&id=Z30I5&name=image.png&originHeight=233&originWidth=867&originalType=binary&ratio=1&rotation=0&showTitle=false&size=24521&status=done&style=none&taskId=u9636ab59-7fa6-47b2-868d-82124e05f10&title=&width=963.3333588529523)

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

![Image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656007703043-3d715e75-d978-4299-b119-7f3ef67c40b0.png#clientId=uffbeb2ac-353f-4&from=paste&height=885&id=ntvj9&name=Image.png&originHeight=708&originWidth=1405&originalType=binary&ratio=1&rotation=0&showTitle=false&size=128296&status=done&style=none&taskId=u1e88bf26-0b9c-4a5e-b53c-257e66c6a72&title=&width=1756.249973829836)

注意：Maven 会自动检测 version 版本号的命名，根据是否包含 SNAPSHOT 关键字进行匹配识别。<br />当发布 SNAPSHOT 版本时，必须在版本号末尾添加-SNAPSHOT 后缀，然后自动发布到 snapshotRepository 配置节点，示例：2.3.12-SNAPSHOT。<br />当发布 RELEASE 版本时，只要不带 SNAPSHOT 关键字的均识别为 RELEASE 版本,自动发布到 repository 节点，根据规范建议在 RELEASE 版本中添加.RELEASE 后缀，如 2.3.12.RELEASE。

### 5. 发布成功后，可在 Browse 对应仓库或者分组中查看到。

![image.png](https://cdn.nlark.com/yuque/0/2022/png/28877441/1656008038946-7ff178a4-3a55-46e5-a1bd-7453175cc298.png#clientId=uf9c081b1-ec25-4&from=paste&height=744&id=ub0804365&name=image.png&originHeight=595&originWidth=1021&originalType=binary&ratio=1&rotation=0&showTitle=false&size=35169&status=done&style=none&taskId=u08696f0a-0d20-4c46-9b53-92b86e8ed92&title=&width=1276.2499809823933)
