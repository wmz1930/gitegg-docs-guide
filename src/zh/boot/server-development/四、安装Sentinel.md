---
title: 四、安装Sentinel
icon: plugin
order: 4
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Sentinel
---

<a name="bc071e71"></a>

### 1. 下载 Sentinel 发布版本，地址[https://github.com/alibaba/Sentinel/releases](https://github.com/alibaba/Sentinel/releases)

<a name="bb04187c"></a>

### 2. 将下载的 jar 包 sentinel-dashboard-1.8.0.jar 上传到 CentOS7 服务器，Sentinel 是一个标准的 Spring Boot 应用，以 Spring Boot 的方式运行 jar 包即可，执行启动命令

```
nohup java -Dserver.port=8086 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-1.8.0.jar >/dev/null &
```

如果是 windows 系统环境，启动命令如下：

`java -Dserver.port=8086 -Dcsp.sentinel.dashboard.server=127.0.0.1:8086 -Dproject.name=sentinel-dashboard -jar sentinel-dashboard-1.8.0.jar`

<a name="95d4ee9c"></a>

### 3. 在浏览器输入测试的 http://ip:8086 即可访问登录界面，默认用户名密码为 sentinel/sentinel

![](https://cdn.gitegg.com/cloud/docs/images/sentinel%E7%99%BB%E5%BD%95%E9%A1%B5.png#id=Men6U&originHeight=468&originWidth=650&originalType=binary&ratio=1&status=done&style=none)

<a name="6caa563c"></a>

### 4. 至此，一个简单的 Sentinel 就部署成功了，其他更详细功能及使用方式请参考：[Sentinel WiKi](https://github.com/alibaba/Sentinel/wiki/%E4%BB%8B%E7%BB%8D)
