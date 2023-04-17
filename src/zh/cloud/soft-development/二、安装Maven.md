---
title: 二、安装 Maven
icon: class
order: 2
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Maven
---

&emsp;&emsp;我们的 SpringCloud 项目使用 Maven 进行构建和依赖管理，Maven 的 Snapshot 版本与 Release 版本：Snapshot 版本代表不稳定、尚处于开发中的版本；Release 版本则代表稳定的版本。_Gradle 作为构建工具最近几年也比流行，和 Maven 比较各有优缺点吧，如果说哪一个比较好，这个仁者见仁智者见智，我们这里仍选择 Maven 进行项目构建。_

<a name="91b511a5"></a>

### 1. 下载安装：

Maven(http://maven.apache.org/download.cgi)需要JDK的支持，我们这里选择最新的Manven版本3.6.3，需要JDK1.7以上的支持，JDK的安装以及配置在上面我们已经完成。 下载 Maven 的 zip 包: [apache-maven-3.6.3-bin.zip](https://mirrors.bfsu.edu.cn/apache/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.zip)

![](https://cdn.gitegg.com/cloud/docs/images/Maven%E4%B8%8B%E8%BD%BD%E9%A1%B5.png#id=u3mpn&originHeight=1311&originWidth=1044&originalType=binary&ratio=1&status=done&style=none)

<a name="20c688bc"></a>

### 2. 配置环境：

在系统环境变量中添加 M2_HOME 和 MAVEN_HOME，最后在 PATH 中添加 Maven 的 bin 目录: %MAVEN_HOME%\bin

![](https://cdn.gitegg.com/cloud/docs/images/M2_HOME.png#id=KpGc9&originHeight=660&originWidth=617&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/M2_BIN.png#id=G0Sjy&originHeight=660&originWidth=618&originalType=binary&ratio=1&status=done&style=none)

<a name="ec981f89"></a>

### 3. 验证是否安装配置成功:

运行 -> cmd 命令窗口，在命令行中输入：mvn -version ，如下图所示，展示版本信息说明安装配置成功。

![](https://cdn.gitegg.com/cloud/docs/images/Maven%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF.png#id=vQsZR&originHeight=218&originWidth=662&originalType=binary&ratio=1&status=done&style=none)

<a name="a78126fa"></a>

### 4. 注册阿里云私服并获取私服仓库地址：

我们可以选择安装 Nexus 作为 Maven 仓库管理器，也可以使用阿里云提供的 Maven 私服，配置方式都是一样的，这里我们选择使用[阿里云的 Maven 私服](https://maven.aliyun.com/mvn/guide)，如果是企业使用，这里建议申请私有仓库：

![](https://cdn.gitegg.com/cloud/docs/images/%E9%98%BF%E9%87%8CMaven%E4%BB%93%E5%BA%93.png#id=MHhEv&originHeight=759&originWidth=1843&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93.png#id=liSdf&originHeight=627&originWidth=1908&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E7%A7%81%E6%9C%89%E4%BB%93%E5%BA%93%E5%9C%B0%E5%9D%80.png#id=vg1Gf&originHeight=866&originWidth=1904&originalType=binary&ratio=1&status=done&style=none)

<a name="277b8041"></a>

### 5. 配置 Maven 私服地址和本地仓库路径，请按下面的注释进行替换为自己的私有仓库信息。

```
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0 http://maven.apache.org/xsd/settings-1.0.0.xsd">
        <!--请替换为自己本地的仓库地址-->
	<localRepository>D:\maven\repository</localRepository>
    <mirrors>
        <mirror>
            <id>mirror</id>
            <mirrorOf>!rdc-releases,!rdc-snapshots</mirrorOf>
            <name>mirror</name>
            <url>http://maven.aliyun.com/nexus/content/groups/public</url>
        </mirror>
    </mirrors>
    <servers>
        <server>
            <id>rdc-releases</id>
            <username>用户名/密码请替换为自己阿里云仓库的</username>
            <password>用户名/密码请替换为自己阿里云仓库的</password>
        </server>
        <server>
            <id>rdc-snapshots</id>
            <username>用户名/密码请替换为自己阿里云仓库的</username>
            <password>用户名/密码请替换为自己阿里云仓库的</password>
        </server>
    </servers>
    <profiles>
        <profile>
            <id>nexus</id>
            <repositories>
                <repository>
                    <id>central</id>
                    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>snapshots</id>
                    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>rdc-releases</id>
                   <!--下面的url替换为自己的阿里云私服地址-->
                    <url>替换为自己的阿里云私服地址</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </repository>
                <repository>
                    <id>rdc-snapshots</id>
                    <url>替换为自己的阿里云私服地址</url>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </repository>
            </repositories>
            <pluginRepositories>
                <pluginRepository>
                    <id>central</id>
                    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>snapshots</id>
                    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>rdc-releases</id>
                   <!--下面的url替换为自己的阿里云私服地址-->
                    <url>替换为自己的阿里云私服地址</url>
                    <releases>
                        <enabled>true</enabled>
                    </releases>
                    <snapshots>
                        <enabled>false</enabled>
                    </snapshots>
                </pluginRepository>
                <pluginRepository>
                    <id>rdc-snapshots</id>
                    <!--下面的url替换为自己的阿里云私服地址-->
                    <url>替换为自己的阿里云私服地址</url>
                    <releases>
                        <enabled>false</enabled>
                    </releases>
                    <snapshots>
                        <enabled>true</enabled>
                    </snapshots>
                </pluginRepository>
            </pluginRepositories>
        </profile>
    </profiles>
    <activeProfiles>
        <activeProfile>nexus</activeProfile>
    </activeProfiles>
</settings>
```
