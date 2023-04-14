---
title: 框架介绍【GitEgg-Boot版本文档正在更新】
icon: info
category:
  - GitEggCloud
tag:
  - SpringCloud
---

::: tip

如果您在使用过程中遇到了 bug，可以 [提一个 issue](https://github.com/wmz1930/GitEgg/issues) 或者 加入微信群 (作者微信: gitegg) 进行反馈。因个人精力有限，欢迎有兴趣和时间的同学共同参与完善。我们将认真和您探讨技术、设计以及实现方案等相关问题。

:::

## 框架特点 ✨

MIT 协议，开源免费，GitEgg（Spring Boot2 + SpringCloud Hoxton.SR8 + SpringCloud Alibaba + Vue3 + uni-app） 是一款开源免费的企业级微服务应用开发框架，旨在整合目前主流稳定的开源技术框架，集成常用的最佳项目解决方案，实现可直接使用的微服务快速开发框架。

## 框架介绍 ✨

### 为什么做？

&emsp;&emsp;工作中遇到过很多难题，也设计出很多自认为很满意的解决方案，随着工作经验的积累，总想着把这些解决问题的方式方法，对于某些需求的合理设计方案整理汇总一下，一是希望能够完整记录自己工作学习的一套知识体系；二是分享出来，希望大家能够批评指正，指出不足，寻找更为优秀合理的解决方案。

&emsp;&emsp;了解过很多款优秀的开源框架，从 Spring+Struts2+MyBatis 的 SSM 框架到 Spring+StringMVC+Mybatis 的 SSM 框架，再到 SpringBoot+MyBatis+Vue 的前后端分离框架。不管技术如何更新，其实都是解决目前技术框架的缺陷，提供更便捷的开发方式和工具，那些框架中最基础的东西，也是最经典的其实并未改变，比如：基于 RBAC 的权限管理模型、数据字典、日志记录、常用的设计模式等等，无论各种开源框架的层出不穷，无非围绕新兴技术栈的更新，来将最基础的设计模式、必需功能来设计开发，重新包装推广出来。当然，也有在开发框架基础上，在某一方面的垂直领域开发出行业开源框架，比如：某某电商平台、某某小程序管理平台、某某办公平台。这类快速开发框架给出了某些行业中的一些完善的解决方案和代码实现，如果要快速开发某一领域的软件，则可以直接使用，非常的方便。

&emsp;&emsp;过去我觉得层出不穷的各种快速开发框架就是在重复造轮子，毫无意义。随着工作经验的增长才发现，并不是大家喜欢重复造轮子，而是每个造轮子的人都会将自己的经验和创新放到历史的轮子上产生新的轮子，这种不断的总结和创新推动着整个开源框架的不断前进和发展。当别人都在框架这条路上做加法，我们只想做减法。一个不想做大而全的框架，只想做小而精，你想要的的功能都有，你不想要的功能不会附加。集成目前主流开发框架，提供主流技术开发需要的基础技术能力，总结多年团队开发经验，满足大多数企业的业务需求。简单开发，快捷部署，学习入门简单，可快速实现业务需求。

### 如何做？

&emsp;&emsp;那么，综合以上，出于对现有框架的分析总结，我希望能有这样的一款框架是：能够将那些自始至终未有改动或者改动很小的功能模块抽取出来，组成框架基础服务模块，当技术栈更新时，可以快速组成新的快速开发框架；对于某些垂直领域的解决方法、方式方法抽取出来，作为框架的功能插件，在需要时，可以根据需求组合成不同的功能系统。

### 做什么？

&emsp;&emsp;在技术栈的选择方面，我选择了目前最为前端流行的技术栈，且选择了最新发布的稳定版本，下面详细列出了 GitEgg 框架所具有的的功能，以及实现其功能所使用的开源技术栈：

- 微服务框架组件：Spring Boot2 + SpringCloud Hoxton.SR8 + SpringCloud Alibaba
- Spring Boot Admin: 管理和监控 SpringBoot 应用程序的微服务健康状态
- 数据持久化组件：MySql + Druid + MyBatis + MyBatis-Plus
- 数据库读写分离及多数据源 + 分库分表：dynamic-datasource + shardingsphere-jdbc
- 分布式事务管理，跨服务的业务操作保持数据一致性 : Seata
- 高性能的 key-value 缓存数据库：Redis + RedissonClient + RedisTemplate
- API 接口文档: Swagger2 + knife4j
- 接口参数校验：spring-boot-starter-validation
- Nacos：一个更易于构建云原生应用的动态服务发现、配置管理和服务管理平台
- Sentinel：把流量作为切入点，从流量控制、熔断降级、系统负载保护等多个维度保护服务的稳定性
- OpenFeign: 微服务架构下服务之间的调用的解决方案 + Ribbon 实现负载均衡/高可用重试机制
- Gateway: 微服务路由转发 + 聚合 knife4j 微服务文档 + 【Gateway+OAuth2+JWT 微服务统一认证授权】
- Oauth2：SpringSecurity 单点登录功能支持多终端认证授权 + RBAC 权限框架
- 验证码：集成滑动验证码【AJ-Captcha】 + 图片验证码【EasyCaptcha】
- 多租户: 基于 Mybatis-Plus【TenantLineInnerInterceptor】插件实现多租户功能
- 数据权限: 基于 Mybatis-Plus【DataPermissionHandler】分页插件实现可配置的数据权限功能
- 对象存储服务( OSS)：MinIO + 阿里云 + 七牛云 + 腾讯云 + 百度云 + 华为云
- 工作流：Flowable 轻量级业务流程引擎
- XXL-JOB：分布式任务调度平台，作业调度系统
- Ant-design-vue + ElementUI （基础）优秀流行的前端开源框架整合
- uni-app: 可发布到 iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台 (本框架中主要用于 H5、小程序)
- Flutter: 给开发者提供简单、高效的方式来构建和部署跨平台、高性能移动应用 (本框架中主要用于移动应用)
- EKL: Elasticsearch + Logstash + Kibana 分布式日志监控平台
- 代码生成器： 基于 Mybatis-Plus 代码生成插件开发的，便捷可配置的代码生成器
- Keepalived + Nginx: 高可用 + 高性能的 HTTP 和反向代理 web 服务器
- DevOps : kubernetes + docker + jenkins 实现持续集成（CI）和持续交付（CD）
- 数据报表：基于 Ant-design-vue + Echarts 实现的自定义数据可视化报表

### 它是如何工作的？

![GitEgg架构图](http://img.gitegg.com/cloud/docs/images/GitEgg架构图.png)

### 源码目录结构

- 基于对敏捷开发 L 型代码结构 的理解，以及过往研发过程中的经验，项目分为 GitEgg-Platform（基础平台）和 GitEgg-Cloud（业务平台）两个工程。
- L 型代码结构详细内容请参考： [敏捷开发“松结对编程”系列之十一：L 型代码结构（团队篇之一）](https://blog.csdn.net/lancees/article/details/7914738)

- 公共平台代码目录结构 GitEgg-Platform

```
GitEgg-Platform
├── gitegg-platform-base -- GitEgg平台公共基础
├── gitegg-platform-bom -- GitEgg平台包统一管理
├── gitegg-platform-boot -- GitEgg平台SpringBoot定制模块
├── gitegg-platform-cache -- GitEgg平台缓存配置模块
├── gitegg-platform-captcha -- GitEgg平台验证码模块
├── gitegg-platform-cloud -- GitEgg平台SpringCloud定制模块
├── gitegg-platform-db -- GitEgg平台数据库链接定制模块
├── gitegg-platform-dev -- GitEgg平台代码生成基础模块
├── gitegg-platform-dfs -- GitEgg分布式文件存储接口定义
├── gitegg-platform-dfs-aliyun -- GitEgg分布式文件存储-阿里云
├── gitegg-platform-dfs-minio -- GitEgg分布式文件存储-minio
├── gitegg-platform-dfs-qiniu -- GitEgg分布式文件存储-七牛云
├── gitegg-platform-dfs-starter -- GitEgg分布式文件存储-starter（方便统一引入dfs服务）
├── gitegg-platform-dfs-tencent -- GitEgg分布式文件存储-腾讯云
├── gitegg-platform-mybatis -- GitEgg平台Mybatis自定义扩展模块
├── gitegg-platform-oauth2 -- GitEgg平台Oauth2自定义扩展模块
├── gitegg-platform-pay -- GitEgg平台统一支付模块
├── gitegg-platform-redis -- GitEgg平台Redis自定义配置模块
├── gitegg-platform-sms -- GitEgg平台短信模块接口定义
├── gitegg-platform-sms-aliyun -- GitEgg平台短信模块-阿里云
├── gitegg-platform-sms-qiniu -- GitEgg平台短信模块-七牛云
├── gitegg-platform-sms-starter -- GitEgg平台短信模块-starter（方便统一引入短信服务）
├── gitegg-platform-sms-tencent -- GitEgg平台短信模块-腾讯云
├── gitegg-platform-swagger -- GitEgg平台Swagger文档
├── gitegg-platform-push -- GitEgg平台消息推送模块
└── gitegg-platform-wechat -- GitEgg平台微信对接模块
```

- 业务平台代码目录结构 GitEgg-Cloud

```
GitEgg-Cloud
├── gitegg-common -- 公共模块工程
├── gitegg-gateway -- 网关
├── gitegg-oauth -- oauth2鉴权
└── gitegg-plugin -- 系统插件工程
     ├── gitegg-code-generator -- 代码生成模块
     ├── gitegg-flowable -- 工作流模块
     └── gitegg-xxl-job -- 定时任务模块
└── gitegg-service -- 微服务功能模块
     ├── gitegg-service-base -- 系统基础服务
     ├── gitegg-service-bigdata -- 大数据处理服务
     ├── gitegg-service-extension -- 系统服务扩展（短信、微信、分布式存储）
     └── gitegg-service-system -- 系统配置服务（权限、资源）
└── gitegg-service-client -- 微服务功能统一定义的Feign Cilent
     ├── gitegg-service-base-client -- 系统基础服务Feign Cilent
     ├── gitegg-service-bigdata-client -- 大数据处理服务Feign Cilent
     ├── gitegg-service-extension-client -- 系统服务扩展（短信、微信、分布式存储）Feign Cilent
     └── gitegg-service-system-client -- 系统配置服务（权限、资源）Feign Cilent
```

### 反馈和支持

- 项目官网: https://cloud.gitegg.com
- Vue3 演示: https://v3.gitegg.com/
- Vue2 演示: https://demo.gitegg.com/
- github: https://github.com/wmz1930/GitEgg
- gitee : https://gitee.com/wmz1930/GitEgg
- 技术交流群:

![技术交流](http://img.gitegg.com/cloud/docs/images/20230411120043.png)

#### &emsp;&emsp;欢迎提交 pull request，issue 以及优秀的改进建议，我们将认真和您探讨技术、设计以及实现方案等相关问题。

<!-- ::: tip

这里还有一些其他没有被主题捆绑的插件，你可以根据自己的需求自行启用。

- <ProjectLink name="lightgallery" path="/zh/">vuepress-plugin-lightgallery</ProjectLink>: 基于 lightgallery 图片浏览插件

- <ProjectLink name="redirect" path="/zh/">vuepress-plugin-redirect</ProjectLink>: 重定向插件

- <ProjectLink name="remove-pwa" path="/zh/">vuepress-plugin-remove-pwa</ProjectLink>: 移除 PWA 插件

- <ProjectLink name="search-pro" path="/zh/">vuepress-plugin-search-pro</ProjectLink>: 客户端搜索插件

::: -->
