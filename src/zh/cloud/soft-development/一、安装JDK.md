---
title: 一、安装 JDK
icon: java
order: 1
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - JDK
---

<a name="2b266e10"></a>

&emsp;&emsp;2019 年 4 月 16 日，Oracle 发布了 Oracle JDK 的 8u211 和 8u 212 两个版本（属于 JDK8 系列），并从这两个版本开始将 JDK 的授权许可从 BCL 换成了 OTN，也就是从这两个版本开始商用收费。当然，_个人开发和测试并不会收费_，那么商用环境我们可以有两个选择: 下载之前的版本(2019 年 1 月 15 日发布的 Oracle JDK 8u201 和[8u202](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html))进行使用或者选择使用[OpenJDK](http://openjdk.java.net/)。_目前我们一般的做法是在本地开发环境使用 Oracle JDK ，在测试环境和正式环境中使用 OpenJDK。为了保持使用的特性一致，需选择合适的版本。_<br /> 我们这里在开发过程中选择使用 Oracke JDK, Oracle JDK 官网下载选择页面已标注好 8u211 后面的版本和 8u202 之前的版本方便下载，[https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html](https://www.oracle.com/java/technologies/oracle-java-archive-downloads.html)

![](https://cdn.gitegg.com/cloud/docs/images/Oracle%20JDK%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD%E9%A1%B5.png#id=fymjU&originHeight=1356&originWidth=993&originalType=binary&ratio=1&status=done&style=none)

<a name="813b044a"></a>

### 1. 选择 JDK 免费版进行下载，根据自己合适的 Windows 系统版本下载，我这里选择 Windows x64 版本，_提前做好 Oracke JDK 网站的系统注册和登录，否则在下载过程中会提示登录_，[选择页面](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html)：

![](https://cdn.gitegg.com/cloud/docs/images/Oracle%20JDK%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD%E9%A1%B5.png#id=PvuAv&originHeight=1356&originWidth=993&originalType=binary&ratio=1&status=done&style=none)

<a name="c91eedd9"></a>

### 2. 双击下载的 Oracle JDK 进行安装，根据提示一步步地点击下一步即可：

![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E4%B8%80.png#id=oLR9v&originHeight=380&originWidth=499&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E4%BA%8C.png#id=aMSFZ&originHeight=380&originWidth=499&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E4%B8%89.png#id=ccR88&originHeight=383&originWidth=501&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E5%9B%9B.png#id=khaBI&originHeight=381&originWidth=701&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E4%BA%94.png#id=Ex6Px&originHeight=378&originWidth=700&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E5%AE%89%E8%A3%85%E5%85%AD.png#id=UTyp4&originHeight=378&originWidth=498&originalType=binary&ratio=1&status=done&style=none)

<a name="39952b67"></a>

### 3. 配置环境变量：

<a name="9e5ea5f2"></a>

#### 在系统环境变量中添加 JAVA_HOME 和 CLASSPATH，并将 JAVA 的 bin 目录加入到 path 中

![](https://cdn.gitegg.com/cloud/docs/images/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F1.png#id=enBak&originHeight=658&originWidth=618&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F2.png#id=kjR1C&originHeight=657&originWidth=618&originalType=binary&ratio=1&status=done&style=none)

<a name="8ab6e98f"></a>

### 4. 验证是否安装配置成功:

运行 -> cmd 命令窗口，在命令行中输入：java -version，下面出现版本信息说明安装配置成功。

![](https://cdn.gitegg.com/cloud/docs/images/Java%E7%89%88%E6%9C%AC%E4%BF%A1%E6%81%AF.png#id=v7GrE&originHeight=362&originWidth=632&originalType=binary&ratio=1&status=done&style=none)
