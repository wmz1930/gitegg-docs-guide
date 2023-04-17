---
title: 五、配置Sentinel
icon: structure
order: 6
category:
  - 快速开始
tag:
  - 快速开始
  - 安装
  - Sentinel
---

<a name="1804c614"></a>

### 1. Sentinel 是一个标准的 Spring Boot 应用，以 Spring Boot 的方式运行 jar 包即可，在官网下载好 sentinel-dashboard-1.8.2.jar 包之后，直接运行启动命令（Windows）：

```
java '-Dserver.port=8086' '-Dcsp.sentinel.dashboard.server=127.0.0.1:8086' '-Dproject.name=sentinel-dashboard' -jar sentinel-dashboard-1.8.2.jar
```

请注意 Windows 的下执行命令，参数需要加单引号，否则会报 错误: 找不到或无法加载主类 .port=错误

<a name="ab9588ed"></a>

### 2. 启动成功之后，访问 Sentinel 管理台地址：[http://127.0.0.1:8086](http://127.0.0.1:8086) ， 默认用户名/密码：sentinel/sentinel。

![](https://cdn.gitegg.com/cloud/docs/images/Sentinel.png#id=Nuk7k&originHeight=1240&originWidth=2560&originalType=binary&ratio=1&status=done&style=none)

<a name="853fa1dc"></a>

### 3. 在 Nacos 中配置 Sentinel 相关配置项，新增配置项 Data ID 为 gitegg-config-sentinel，Group 为 GITEGG 的配置项，请注意，这里的配置格式是 JSON。

```
[
    {
        "resource": "/system/sentinel/protected",
        "count": 5,
        "grade": 1,
        "limitApp": "default",
        "strategy": 0,
        "controlBehavior": 0,
        "clusterMode": false
    }
]
```

![](https://cdn.gitegg.com/cloud/docs/images/SentinelNacos1.png#id=eW05X&originHeight=939&originWidth=2547&originalType=binary&ratio=1&status=done&style=none)

<a name="aa1d9c6a"></a>

### 4. 在 Nacos 中 gitegg-config.yaml 配置项中修改相关 Sentinel 配置。

```
  cloud:
    sentinel:
      filter:
        enabled: true
      transport:
        port: 8719
        dashboard: 127.0.0.1:8086
      eager: true
      datasource:
        ds2:
          nacos:
            data-type: json
            server-addr: 127.0.0.1:8848
            dataId: gitegg-config-sentinel
            groupId: GITEGG
            rule-type: flow
```

![](https://cdn.gitegg.com/cloud/docs/images/SentinelNacos2.png#id=i0dkq&originHeight=1006&originWidth=2560&originalType=binary&ratio=1&status=done&style=none)
