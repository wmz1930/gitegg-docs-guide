---
title: 八、Jenkins 自动打包部署配置
icon: symbol
order: 8
category:
  - 持续集成
tag:
  - 持续集成
  - K8S
  - 集群
  - CI
  - CD
---

&emsp;&emsp;项目部署有多种方式，从最原始的可运行 jar 包直接部署到 JDK 环境下运行，到将可运行的 jar 包放到 docker 容器中运行，再到现在比较流行的把可运行的 jar 包和 docker 放到 k8s 的 pod 环境中运行。每一种新的部署方式都是对原有部署方式的改进和优化，这里不着重介绍每种方式的优缺点，只简单说明一下使用 Kubernetes 的原因：Kubernetes 主要提供弹性伸缩、服务发现、自我修复，版本回退、负载均衡、存储编排等功能。

&emsp;&emsp;日常开发部署过程中的基本步骤如下：

- 提交代码到 gitlab 代码仓库
- gitlab 通过 webhook 触发 Jenkins 构建代码质量检查
- Jenkins 需通过手动触发，来拉取代码、编译、打包、构建 Docker 镜像、发布到私有镜像仓库 Harbor、执行 kubectl 命令从 Harbor 拉取 Docker 镜像部署至 k8s

<a name="ft4bs"></a>

## 一、安装配置

### 1. 安装插件

&emsp;&emsp;安装[Kubernetes plugin](https://plugins.jenkins.io/kubernetes)插件、[Git Parameter](https://plugins.jenkins.io/git-parameter)插件（用于流水线参数化构建）、[Extended Choice Parameter](https://plugins.jenkins.io/extended-choice-parameter)插件（用于多个微服务时，选择需要构建的微服务）、 [Pipeline Utility Steps](https://plugins.jenkins.io/pipeline-utility-steps)插件（用于读取 maven 工程的.yaml、pom.xml 等）和 [Kubernetes Continuous Deploy](https://plugins.jenkins.io/kubernetes-cd)（一定要使用 1.0 版本，从[官网](https://plugins.jenkins.io/kubernetes-cd/#releases)下载然后上传） ，Jenkins --> 系统管理 --> 插件管理 --> 可选插件 --> Kubernetes plugin /Git Parameter/Extended Choice Parameter ,选中后点击 Install without restart 按钮进行安装<br />![](http://img.gitegg.com/cloud/docs/images/20211221102722.png#id=ymuM0&originHeight=75&originWidth=1207&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102732.png#id=Y9Pu2&originHeight=81&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102741.png#id=F7Fz4&originHeight=100&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102751.png#id=EMuG7&originHeight=656&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

       Blueocean目前还不支持Git Parameter插件和Extended Choice Parameter插件，Git Parameter是通过Git Plugin读取分支信息，我们这里使用Pipeline script而不是使用Pipeline script from SCM，是因为我们不希望把构建信息放到代码里，这样做可以开发和部署分离。

<a name="GzWoZ"></a>

### 2. 配置[Kubernetes plugin](https://plugins.jenkins.io/kubernetes)插件，Jenkins --> 系统管理 --> 节点管理 --> Configure Clouds -->  Add a new cloud -> Kubernetes

![](http://img.gitegg.com/cloud/docs/images/20211221102803.png#id=yd21Y&originHeight=552&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="kpeTx"></a>

### 3. 增加 kubernetes 证书

```
cat ~/.kube/config

# 以下步骤暂不使用，将certificate-authority-data、client-certificate-data、client-key-data替换为~/.kube/config里面具体的值
#echo certificate-authority-data | base64 -d > ca.crt
#echo client-certificate-data | base64 -d > client.crt
#echo client-key-data | base64 -d > client.key
# 执行以下命令，自己设置密码
#openssl pkcs12 -export -out cert.pfx -inkey client.key -in client.crt -certfile ca.crt
```

系统管理-->凭据-->系统-->全局凭据

![](http://img.gitegg.com/cloud/docs/images/20211221102816.png#id=eKh7L&originHeight=478&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="oGaDO"></a>

### 4. 添加访问 Kubernetes 的凭据信息，这里填入上面登录 Kubernetes Dashboard 所创建的 token 即可，添加完成之后选择刚刚添加的凭据，然后点击连接测试，如果提示连接成功，那么说明我们的 Jenkins 可以连接 Kubernetes 了

![](http://img.gitegg.com/cloud/docs/images/20211221102826.png#id=oMhkU&originHeight=609&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102837.png#id=fIi6q&originHeight=222&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="VD71l"></a>

### 5. jenkins 全局配置 jdk、git 和 maven

jenkinsci/blueocean 镜像默认安装了 jdk 和 git，这里需要登录容器找到路径，然后配置进去，通过命令进入 jenkins 容器，并查看 JAVA_HOEM 和 git 路径。

```
[root@localhost ~]# docker ps
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS                         PORTS                                                                                      NAMES
0520ebb9cc5d        jenkinsci/blueocean                  "/sbin/tini -- /usr/…"   2 days ago          Up 30 hours                    50000/tcp, 0.0.0.0:18080->8080/tcp, :::18080->8080/tcp                                     root-jenkins-1
[root@localhost ~]# docker exec -it 0520ebb9cc5d /bin/bash
bash-5.1# echo $JAVA_HOME
/opt/java/openjdk
bash-5.1# which git
/usr/bin/git
```

通过命令查询可知，JAVA_HOME=/opt/java/openjdk    GIT= /usr/bin/git ， 在 Jenkins 全局工具配置中配置

![](http://img.gitegg.com/cloud/docs/images/20211221102854.png#id=hByXv&originHeight=616&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

Maven 可以在宿主机映射的/data/docker/ci/jenkins/home 中安装，然后配置时，配置容器路径为/var/jenkins_home 下的 Maven 安装路径

![](http://img.gitegg.com/cloud/docs/images/20211221102904.png#id=v1pfi&originHeight=291&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

在系统配置中设置 MAVEN_HOME 供 Pipeline script 调用，如果执行脚本时提示没有权限，那么在宿主 Maven 目录的 bin 目录下执行 chmod 777 \*

![](http://img.gitegg.com/cloud/docs/images/20211221102918.png#id=SQNES&originHeight=367&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="AcQkn"></a>

### 6. 为 k8s 新建 harbor-key，用于 k8s 拉取私服镜像，配置在代码的 k8s-deployment.yml 中使用。

```
kubectl create secret docker-registry harbor-key --docker-server=172.16.20.175 --docker-username='robot$gitegg' --docker-password='Jqazyv7vvZiL6TXuNcv7TrZeRdL8U9n3'
```

<a name="axgJJ"></a>

### 7. 新建 pipeline 流水线任务

<br />![](http://img.gitegg.com/cloud/docs/images/20211221102929.png#id=aaqkx&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="b0555"></a>

### 8. 配置流水线任务参数

<br />![](http://img.gitegg.com/cloud/docs/images/20211221102938.png#id=pLzZq&originHeight=4396&originWidth=1056&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="B02tB"></a>

### 9. 配置 pipeline 发布脚本

<br />在流水线下面选择 Pipeline script<br />![](http://img.gitegg.com/cloud/docs/images/20211221102951.png#id=tpJsG&originHeight=509&originWidth=777&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```
pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)', defaultValue: 'master', name: 'Branch', type: 'PT_BRANCH', description:'请选择需要构建的代码分支'
        choice(name: 'BaseImage', choices: ['openjdk:8-jdk-alpine'], description: '请选择基础运行环境')
        choice(name: 'Environment', choices: ['dev','test','prod'],description: '请选择要发布的环境：dev开发环境、test测试环境、prod 生产环境')
        extendedChoice(
        defaultValue: 'gitegg-gateway,gitegg-oauth,gitegg-plugin/gitegg-code-generator,gitegg-service/gitegg-service-base,gitegg-service/gitegg-service-extension,gitegg-service/gitegg-service-system',
        description: '请选择需要构建的微服务',
        multiSelectDelimiter: ',',
        name: 'ServicesBuild',
        quoteValue: false,
        saveJSONParameterToFile: false,
        type: 'PT_CHECKBOX',
        value:'gitegg-gateway,gitegg-oauth,gitegg-plugin/gitegg-code-generator,gitegg-service/gitegg-service-base,gitegg-service/gitegg-service-extension,gitegg-service/gitegg-service-system',
        visibleItemCount: 6)
        string(name: 'BuildParameter', defaultValue: 'none', description: '请输入构建参数')

    }
    environment {
        PRO_NAME = "gitegg"
        BuildParameter="${params.BuildParameter}"
        ENV = "${params.Environment}"
        BRANCH = "${params.Branch}"
        ServicesBuild = "${params.ServicesBuild}"
        BaseImage="${params.BaseImage}"
        k8s_token = "7696144b-3b77-4588-beb0-db4d585f5c04"

    }
    stages {
        stage('Clean workspace') {
            steps {
                deleteDir()
            }
        }
        stage('Process parameters') {
            steps {
                script {

                    if("${params.ServicesBuild}".trim() != "") {
                        def ServicesBuildString = "${params.ServicesBuild}"
                        ServicesBuild = ServicesBuildString.split(",")
                        for (service in ServicesBuild) {
                          println "now got ${service}"
                        }
                    }

                    if("${params.BuildParameter}".trim() != "" && "${params.BuildParameter}".trim() != "none") {
                        BuildParameter = "${params.BuildParameter}"
                    }
                    else
                    {
                        BuildParameter = ""
                    }
                }
            }
        }
        stage('Pull SourceCode Platform') {
            steps {
                echo "${BRANCH}"
                git branch: "${Branch}", credentialsId: 'gitlabTest', url: 'http://172.16.20.188:2080/root/gitegg-platform.git'
            }
        }
        stage('Install Platform') {
            steps{
                echo "==============Start Platform Build=========="
                sh "${MAVEN_HOME}/bin/mvn -DskipTests=true clean install ${BuildParameter}"
                echo "==============End Platform Build=========="
            }
        }

        stage('Pull SourceCode') {
            steps {
                echo "${BRANCH}"
                git branch: "${Branch}", credentialsId: 'gitlabTest', url: 'http://172.16.20.188:2080/root/gitegg-cloud.git'
            }
        }

        stage('Build') {
            steps{
              script {
                echo "==============Start Cloud Parent Install=========="
                sh "${MAVEN_HOME}/bin/mvn -DskipTests=true clean install -P${params.Environment} ${BuildParameter}"
                echo "==============End Cloud Parent Install=========="
                def workspace = pwd()
                for (service in ServicesBuild) {
                   stage ('buildCloud${service}') {
                      echo "==============Start Cloud Build ${service}=========="
                      sh "cd ${workspace}/${service} && ${MAVEN_HOME}/bin/mvn -DskipTests=true clean package -P${params.Environment} ${BuildParameter} jib:build -Djib.httpTimeout=200000 -DsendCredentialsOverHttp=true -f pom.xml"
                      echo "==============End Cloud Build ${service}============"
                   }
                }
               }
            }
        }
        stage('Sync to k8s') {
            steps {
                script {
                   echo "==============Start Sync to k8s=========="
                   def workspace = pwd()

                   mainpom = readMavenPom file: 'pom.xml'
                   profiles = mainpom.getProfiles()

                   def version = mainpom.getVersion()

                   def nacosAddr = ""
                   def nacosConfigPrefix = ""
                   def nacosConfigGroup = ""

                   def dockerHarborAddr = ""
                   def dockerHarborProject = ""
                   def dockerHarborUsername = ""
                   def dockerHarborPassword = ""

                   def serverPort = ""

                   def commonDeployment = "${workspace}/k8s-deployment.yaml"

                   for(profile in profiles)
                   {
                       // 获取对应配置
                       if (profile.getId() == "${params.Environment}")
                       {
                            nacosAddr = profile.getProperties().getProperty("nacos.addr")
                            nacosConfigPrefix = profile.getProperties().getProperty("nacos.config.prefix")
                            nacosConfigGroup = profile.getProperties().getProperty("nacos.config.group")
                            dockerHarborAddr = profile.getProperties().getProperty("docker.harbor.addr")
                            dockerHarborProject =  profile.getProperties().getProperty("docker.harbor.project")
                            dockerHarborUsername = profile.getProperties().getProperty("docker.harbor.username")
                            dockerHarborPassword = profile.getProperties().getProperty("docker.harbor.password")
                       }

                   }


                   for (service in ServicesBuild) {
                      stage ('Sync${service}ToK8s') {
                        echo "==============Start Sync ${service} to k8s=========="
                        dir("${workspace}/${service}") {
                            pom = readMavenPom file: 'pom.xml'
                            echo "group: artifactId: ${pom.artifactId}"
                            def deployYaml = "k8s-deployment-${pom.artifactId}.yaml"
                            yaml = readYaml file : './src/main/resources/bootstrap.yml'
                            serverPort = "${yaml.server.port}"
                            if(fileExists("${workspace}/${service}/k8s-deployment.yaml")){
			                   commonDeployment = "${workspace}/${service}/k8s-deployment.yaml"
			                }
			                else
			                {
			                   commonDeployment = "${workspace}/k8s-deployment.yaml"
			                }
                            script {
                                sh "sed 's#{APP_NAME}#${pom.artifactId}#g;s#{IMAGE_URL}#${dockerHarborAddr}#g;s#{IMAGE_PROGECT}#${PRO_NAME}#g;s#{IMAGE_TAG}#${version}#g;s#{APP_PORT}#${serverPort}#g;s#{SPRING_PROFILE}#${params.Environment}#g' ${commonDeployment} > ${deployYaml}"
                                kubernetesDeploy configs: "${deployYaml}", kubeconfigId: "${k8s_token}"
                            }
                        }
                        echo "==============End Sync ${service} to k8s=========="
                      }
                   }

                   echo "==============End Sync to k8s=========="
                }
            }
        }
    }

}
```

<a name="39b71352"></a>

## 常见问题：

<a name="tD9s2"></a>

### 1. Pipeline Utility Steps 第一次执行会报错 Scripts not permitted to use method 或者 Scripts not permitted to use staticMethod org.codehaus.groovy.runtime.DefaultGroovyMethods getProperties java.lang.Object

解决：系统管理-->In-process Script Approval->点击 Approval
![](http://img.gitegg.com/cloud/docs/images/20211221103003.png#id=UsjSd&originHeight=457&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
![](http://img.gitegg.com/cloud/docs/images/20211221103013.png#id=n2ff4&originHeight=615&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="mtX7Y"></a>

### 2. 通过 NFS 服务将所有容器的日志统一存放在 NFS 的服务端

<a name="RapYK"></a>

### 3. [Kubernetes Continuous Deploy](https://plugins.jenkins.io/kubernetes-cd),使用 1.0.0 版本，否则报错，不兼容

<a name="hwsH3"></a>

### 4. 解决 docker 注册到内网问题

```
spring:
  cloud:
    inetutils:
      ignored-interfaces: docker0
```

<a name="ZXS6y"></a>

### 5. 配置 ipvs 模式，kube-proxy 监控 Pod 的变化并创建相应的 ipvs 规则。ipvs 相对 iptables 转发效率更高。除此以外，ipvs 支持更多的 LB 算法。

```
kubectl edit cm kube-proxy -n kube-system
```

修改 mode: "ipvs"<br />![](http://img.gitegg.com/cloud/docs/images/20211221103024.png#id=ktJKP&originHeight=731&originWidth=773&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />重新加载 kube-proxy 配置文件

```
kubectl delete pod -l k8s-app=kube-proxy -n kube-system
```

查看 ipvs 规则

```
ipvsadm -Ln
```

<a name="ZG1RX"></a>

### 6. k8s 集群内部访问外部服务，nacos，redis 等

- a、内外互通模式，在部署的服务设置 hostNetwork: true

```
spec:
 hostNetwork: true
```

- b、Endpoints 模式

```
kind: Endpoints
apiVersion: v1
metadata:
  name: nacos
  namespace: default
subsets:
  - addresses:
      - ip: 172.16.20.188
    ports:
      - port: 8848
```

```
apiVersion: v1
kind: Service
metadata:
  name: nacos
  namespace: default
spec:
  type: ClusterIP
  ports:
  - port: 8848
    targetPort: 8848
    protocol: TCP
```

- c、service 的 type: ExternalName 模式,“ExternalName” 使用 CNAME 重定向，因此无法执行端口重映射，域名使用

```
EndPoints和type: ExternalName
```

以上外部新建 yaml，不要用内部的，这些需要在环境设置时配置好。

<a name="OBoYK"></a>

### 7. k8s 常用命令

<br />查看 pod:   kubectl get pods
<br />查看 service: kubectl get svc
<br />查看 endpoints: kubectl get endpoints
<br />安装： kubectl apply -f XXX.yaml
<br />删除：kubectl delete -f xxx.yaml
<br />删除 pod: kubectl delete pod podName
<br />删除 service: kubectl delete service serviceName
<br />进入容器： kubectl exec -it podsNamexxxxxx -n  default -- /bin/sh
