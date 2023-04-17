---
title: 八、Swagger2_Knife4j 文档配置
icon: api
order: 8
category:
  - 二次开发
tag:
  - 二次开发
  - 开发
  - 使用
  - Swagger2
  - Knife4j
---

### 1. gitegg-cloud 使用 knife4j 集成 swagger2 文档，按照官方文档在 gateway 聚合所有微服务文档，因为 Knife4j 不能读取 Nacos 动态服务列表，在新增微服务时，需要在 Nacos 配置文件中 gateway->routes 新增配置如下：

```vue
gateway: discovery: locator: enabled: true routes: #
以下为新增微服务路由，Knife4j读取此配置的Swagger2文档 - id: gitegg-mall uri:
lb://gitegg-mall predicates: - Path=/gitegg-mall/** filters: - StripPrefix=1
```

### 2. 在 Nacos 中配置 Swagger2 相关访问不进行鉴权，在发布到生产环境可以删除这些配置，不要在生产环境访问接口文档

```vue
oauth-list: # 相关静态文件 staticFiles: - "/doc.html" - "/webjars/**" -
"/favicon.ico" - "/swagger-resources/**" whiteUrls: # 接口查询请求 -
"/**/v2/api-docs"
```

### 3. Swagger2 聚合文档访问地址：http://127.0.0.1/doc.html

![](https://cdn.gitegg.com/cloud/docs/images/20230414152009.png)

### 4. 设置公共鉴权请求头 Authorization，如果开启了多租户模式，需要设置 TenantId

![](https://cdn.gitegg.com/cloud/docs/images/20230414152025.png)

### 5. 公共请求头设置好之后，就可以选择自己需要的接口，填写参数进行调试了。

![](https://cdn.gitegg.com/cloud/docs/images/20230414152039.png)
