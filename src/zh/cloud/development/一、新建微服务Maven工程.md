---
title: 一、新建微服务 Maven 工程
icon: create
order: 1
category:
  - 二次开发
tag:
  - 二次开发
  - 开发
  - 使用
  - Maven
---

&emsp;&emsp;gitegg-cloud 是微服务框架，整体功能是非业务相关的基础功能，在实际业务开发过程中需要新建微服务的业务模块，根据业务的整体规划，设计新建 Maven 子工程。<br />   下面以常用的电商项目举例新建 Maven 子工程，电商项目一般包含商品微服务，订单微服务，支付微服务,账户微服务等，我们的整体规划是将电商项目作为一个整体的微服务 Maven 父工程，商品微服务，订单微服务，支付微服务，账户微服务作为电商项目的子工程，微服务之间通过 Feign 相互调用，所以我们在 gitegg-cloud 下新建 gitegg-mall 和 gitegg-mall-client 两个 Maven 工程。<br />![](http://img.gitegg.com/cloud/docs/images/20211116164756.png#id=geE01&originHeight=560&originWidth=1240&originalType=binary&ratio=1&status=done&style=none)

**下面以创建 gitegg-mall 和 gitegg-mall-goods 为例创建 Maven 父子工程：**

### 1. 在 gitegg-cloud 工程上点击右键，然后选择：New > Module...  ，选择 Maven，Create from archetype 不要勾选，点击 Next 进入下一步，填写工程信息。

![](http://img.gitegg.com/cloud/docs/images/20211116164811.png#id=wqbxG&originHeight=671&originWidth=1236&originalType=binary&ratio=1&status=done&style=none)

### 2. 填写项目名称，选择工程代码存放路径，GroupId 、ArtifactId、Version，然后点击 Finish 完成创建。

![](http://img.gitegg.com/cloud/docs/images/20211116164822.png#id=fgNeB&originHeight=671&originWidth=1065&originalType=binary&ratio=1&status=done&style=none)

### 3. 因为 gitegg-mall 工程下面还要存放子模块工程，gitegg-mall 也是一个父工程，所以删除工程下用不到的 src 目录。此时，pom.xml 文件中没有节点 pom，这里不需要处理，当创建子工程之后，这里会自动添加此节点。

![](http://img.gitegg.com/cloud/docs/images/20211116164835.png#id=kjndt&originHeight=356&originWidth=1033&originalType=binary&ratio=1&status=done&style=none)

### 4. 同样的方式创建 gitegg-mall-client 父工程，用于存放微服务之间相互调用的 Feign 客户端。

![](http://img.gitegg.com/cloud/docs/images/20211116164846.png#id=EabBe&originHeight=477&originWidth=1056&originalType=binary&ratio=1&status=done&style=none)

### 5. 创建 gitegg-mall 第一个子工程 gitegg-mall-goods 商品微服务，在 gitegg-mall 工程上点击右键，然后选择：New > Module... > Maven，在 Maven 窗口点击右键选择 org.apache.tapestry:quickstart，在 Name 处填入子工程名称：gitegg-mall-goods，然后点击 Finish，子工程创建完成。

![](http://img.gitegg.com/cloud/docs/images/20211116164858.png#id=Zy6Yn&originHeight=670&originWidth=1064&originalType=binary&ratio=1&status=done&style=none)<br />![](http://img.gitegg.com/cloud/docs/images/20211116164908.png#id=TwqBr&originHeight=671&originWidth=1065&originalType=binary&ratio=1&status=done&style=none)

### 6. 同样的方式创建 gitegg-mall-goods-client 子工程，用于存放商品微服务之间相互调用的 Feign 客户端。

![](http://img.gitegg.com/cloud/docs/images/20211116164922.png#id=UpCQF&originHeight=676&originWidth=1061&originalType=binary&ratio=1&status=done&style=none)<br />![](http://img.gitegg.com/cloud/docs/images/20211116164933.png#id=XcWFn&originHeight=524&originWidth=1034&originalType=binary&ratio=1&status=done&style=none)

### 7. 设置项目依赖库，复制 gitegg-service 下面的 pom.xml 里面的依赖库配置 dependencies，放到 gitegg-mall 的 pom.xml 里。

需要复制的内容：

```
    <dependencies>
        <!-- gitegg Spring Boot自定义及扩展 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-boot</artifactId>
        </dependency>
        <!-- gitegg Spring Cloud自定义及扩展 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-cloud</artifactId>
        </dependency>
        <!-- gitegg数据库驱动及连接池 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-db</artifactId>
        </dependency>
        <!-- gitegg mybatis-plus -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-mybatis</artifactId>
        </dependency>
        <!-- gitegg swagger2-knife4j -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-swagger</artifactId>
        </dependency>
        <!-- gitegg cache自定义扩展 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-cache</artifactId>
        </dependency>
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-redis</artifactId>
        </dependency>
        <!-- spring boot web核心包 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- spring boot 健康监控 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
    </dependencies>
```

### 8. 设置项目依赖库和打包配置，复制 gitegg-service-client 下面的 pom.xml 里面的依赖库配置 dependencies 和 build 内容，放到 gitegg-mall-client 的 pom.xml 里。

需要复制的内容：

```
    <dependencies>
        <!-- gitegg Spring Boot自定义及扩展 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-boot</artifactId>
        </dependency>
        <!-- gitegg Spring Cloud自定义及扩展 -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-cloud</artifactId>
        </dependency>
        <!-- gitegg swagger2-knife4j -->
        <dependency>
            <groupId>com.gitegg.platform</groupId>
            <artifactId>gitegg-platform-swagger</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <!--client模块不打可执行的jar包，打普通jar包即可-->
                    <skip>true</skip>
                </configuration>
            </plugin>
            <plugin>
                <groupId>com.google.cloud.tools</groupId>
                <artifactId>jib-maven-plugin</artifactId>
                <configuration>
                    <!--此模块不打可执行的jar包，打普通jar包即可-->
                    <skip>true</skip>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

### 9. 复制工程配置文件 bootstrap.yml、bootstrap-dev.yml、bootstrap-test.yml、bootstrap-prod.yml 到 gitegg-mall-goods 的 src/main/resources 目录下,gitegg-mall-goods-client 不需要这些配置文件，在 gitegg-mall-goods 的 pom.xml 中新增打包插件配置。<br /> 同样 client 工程相关的配置也需要参考 gitegg-service-client 和 gitegg-service-system-client 里面的 pom.xml 配置，复制到 gitegg-mall-goods 和 gitegg-mall-goods-client 的 pom.xml 中。

```
    <build>
        <plugins>
            <plugin>
                <groupId>com.google.cloud.tools</groupId>
                <artifactId>jib-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
```

### 10. 修改 bootstrap.yml 里面的服务端口配置，修改成一个当前未占用的端口。

![](http://img.gitegg.com/cloud/docs/images/20211116181448.png#id=wwnYP&originHeight=468&originWidth=1140&originalType=binary&ratio=1&status=done&style=none)

### 11. 新建微服务启动类 GitEggMallApplication，可以直接复制 GitEggSystemApplication 然后修改内容，包名根据自己规划，这里设置为 com.gitegg.mall.goods.brand。

GitEggMallApplication 代码

```
/**
 * gitegg-mall 启动类
 * @author GitEgg
 */
@EnableDiscoveryClient
@EnableFeignClients(basePackages = "com.gitegg")
@ComponentScan(basePackages = "com.gitegg")
@SpringBootApplication
public class GitEggMallApplication {
    public static void main(String[] args) {
        SpringApplication.run(GitEggMallApplication.class,args);
    }
}
```

&emsp;&emsp;Maven 工程创建好之后，就可以点击 GitEggMallApplication 右键运行，测试是否配置正确，后面的操作就是编写具体的增删查改等业务逻辑代码。gitegg-cloud 提供代码生成器，下一节介绍说明如何使用代码生成器根据表设计生成前后端代码。
