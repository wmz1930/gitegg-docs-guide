---
title: 六、Docker Compose构建CI全流程
icon: state
order: 6
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - CI
  - CD
---

<a name="C4twJ"></a>

## 一、使用 Docker 安装配置 Jenkins+Sonar（代码质量检查）

<a name="XK5Af"></a>

### 1. 创建宿主机挂载目录并赋权

```
mkdir -p /data/docker/ci/nexus /data/docker/ci/jenkins/lib /data/docker/ci/jenkins/home /data/docker/ci/sonarqube /data/docker/ci/postgresql

chmod -R 777 /data/docker/ci/nexus /data/docker/ci/jenkins/lib /data/docker/ci/jenkins/home /data/docker/ci/sonarqube /data/docker/ci/postgresql
```

<a name="ABWaM"></a>

### 2. 新建 Jenkins+Sonar 安装脚本 jenkins-compose.yml 脚本，这里的 Jenkins 使用的是 Docker 官方推荐的镜像 jenkinsci/blueocean，在实际使用中发现，即使不修改插件下载地址，也可以下载插件，所以比较推荐这个镜像。

```
version: '3'
networks:
  prodnetwork:
    driver: bridge
services:
  sonardb:
    image: postgres:12.2
    restart: always
    ports:
      - "5433:5432"
    networks:
      - prodnetwork
    volumes:
      - /data/docker/ci/postgresql:/var/lib/postgresql
    environment:
      - POSTGRES_USER=sonar
      - POSTGRES_PASSWORD=sonar
  sonar:
    image: sonarqube:8.2-community
    restart: always
    ports:
    - "19000:9000"
    - "19092:9092"
    networks:
      - prodnetwork
    depends_on:
      - sonardb
    volumes:
      - /data/docker/ci/sonarqube/conf:/opt/sonarqube/conf
      - /data/docker/ci/sonarqube/data:/opt/sonarqube/data
      - /data/docker/ci/sonarqube/logs:/opt/sonarqube/logs
      - /data/docker/ci/sonarqube/extension:/opt/sonarqube/extensions
      - /data/docker/ci/sonarqube/bundled-plugins:/opt/sonarqube/lib/bundled-plugins
    environment:
      - TZ=Asia/Shanghai
      - SONARQUBE_JDBC_URL=jdbc:postgresql://sonardb:5432/sonar
      - SONARQUBE_JDBC_USERNAME=sonar
      - SONARQUBE_JDBC_PASSWORD=sonar
  nexus:
    image: sonatype/nexus3
    restart: always
    ports:
      - "18081:8081"
    networks:
      - prodnetwork
    volumes:
      - /data/docker/ci/nexus:/nexus-data
  jenkins:
    image: jenkinsci/blueocean
    user: root
    restart: always
    ports:
      - "18080:8080"
    networks:
      - prodnetwork
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /etc/localtime:/etc/localtime:ro
      - $HOME/.ssh:/root/.ssh
      - /data/docker/ci/jenkins/lib:/var/lib/jenkins/
      - /usr/bin/docker:/usr/bin/docker
      - /data/docker/ci/jenkins/home:/var/jenkins_home
    depends_on:
      - nexus
      - sonar
    environment:
      - NEXUS_PORT=8081
      - SONAR_PORT=9000
      - SONAR_DB_PORT=5432
    cap_add:
      - ALL
```

<a name="EjFKe"></a>

### 3. 在 jenkins-compose.yml 文件所在目录下执行安装启动命令

```
docker-compose -f jenkins-compose.yml up -d
```

安装成功后，展示以下信息

```
[+] Running 5/5
 ⠿ Network root_prodnetwork  Created                                                                0.0s
 ⠿ Container root-sonardb-1  Started                                                                1.0s
 ⠿ Container root-nexus-1    Started                                                                1.0s
 ⠿ Container root-sonar-1    Started                                                                2.1s
 ⠿ Container root-jenkins-1  Started                                                                4.2s
```

<a name="gyQk0"></a>

### 4. 查看服务的启动情况

```
[root@localhost ~]# docker ps
CONTAINER ID        IMAGE                                COMMAND                  CREATED             STATUS                             PORTS                                                    NAMES
52779025a83e        jenkins/jenkins:lts                  "/sbin/tini -- /usr/…"   4 minutes ago       Up 3 minutes                       50000/tcp, 0.0.0.0:18080->8080/tcp, :::18080->8080/tcp   root-jenkins-1
2f5fbc25de58        sonarqube:8.2-community              "./bin/run.sh"           4 minutes ago       Restarting (0) 21 seconds ago                                                               root-sonar-1
4248a8ba71d8        sonatype/nexus3                      "sh -c ${SONATYPE_DI…"   4 minutes ago       Up 4 minutes                       0.0.0.0:18081->8081/tcp, :::18081->8081/tcp              root-nexus-1
719623c4206b        postgres:12.2                        "docker-entrypoint.s…"   4 minutes ago       Up 4 minutes                       0.0.0.0:5433->5432/tcp, :::5433->5432/tcp                root-sonardb-1
2b6852a57cc2        goharbor/harbor-jobservice:v2.2.4    "/harbor/entrypoint.…"   5 days ago          Up 29 seconds (health: starting)                                                            harbor-jobservice
ebf2dea994fb        goharbor/nginx-photon:v2.2.4         "nginx -g 'daemon of…"   5 days ago          Restarting (1) 46 seconds ago                                                               nginx
adfaa287f23b        goharbor/harbor-registryctl:v2.2.4   "/home/harbor/start.…"   5 days ago          Up 7 minutes (healthy)                                                                      registryctl
8e5bcca3aaa1        goharbor/harbor-db:v2.2.4            "/docker-entrypoint.…"   5 days ago          Up 7 minutes (healthy)                                                                      harbor-db
ebe845e020dc        goharbor/harbor-portal:v2.2.4        "nginx -g 'daemon of…"   5 days ago          Up 7 minutes (healthy)                                                                      harbor-portal
68263dea2cfc        goharbor/harbor-log:v2.2.4           "/bin/sh -c /usr/loc…"   5 days ago          Up 7 minutes (healthy)             127.0.0.1:1514->10514/tcp                                harbor-log
```

<a name="D1NEx"></a>

### 5. 我们发现 jenkins 端口映射到了 18081 ，但是 sonarqube 没有启动，查看日志发现 sonarqube 文件夹没有权限访问，日志上显示容器目录的权限不够，但实际是宿主机的权限不够，这里需要给宿主机赋予权限

```
chmod 777 /data/docker/ci/sonarqube/logs
chmod 777 /data/docker/ci/sonarqube/bundled-plugins
chmod 777 /data/docker/ci/sonarqube/conf
chmod 777 /data/docker/ci/sonarqube/data
chmod 777 /data/docker/ci/sonarqube/extension
```

<a name="xzZWH"></a>

### 6. 执行重启命令

```
docker-compose -f jenkins-compose.yml restart
```

<a name="fHGTm"></a>

### 7. 再次使用命令查看服务启动情况，就可以看到 jenkins 映射到 18081，sonarqube 映射到 19000 端口，我们在浏览器就可以访问 jenkins 和 sonarqube 的后台界面了

![](https://cdn.gitegg.com/cloud/docs/images/20211220182048.png#id=dgV0c&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182059.png#id=MUjBF&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br /><br />

<a name="BxvpT"></a>

### 8. Jenkins 登录初始化

从 Jenkins 的登录界面提示可以知道，默认密码路径为/var/jenkins_home/secrets/initialAdminPassword，这里显示的事 Docker 容器内部的路径，实际对应我们上面服务器设置的路径为/data/docker/ci/jenkins/home/secrets/initialAdminPassword ,我们打开这个文件并输入密码就可以进入 Jenkins 管理界面<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182121.png#id=V0HZT&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

### 9. 选择安装推荐插件，安装完成之后，根据提示进行下一步操作，直到进入管理后台界面

![](https://cdn.gitegg.com/cloud/docs/images/20211220182134.png#id=Cfmdb&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://cdn.gitegg.com/cloud/docs/images/20211220182148.png#id=tuMz1&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://cdn.gitegg.com/cloud/docs/images/20211220182159.png#id=u6rKS&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

**备注:**

- sonarqube 默认用户名密码: admin/admin
- 卸载命令：docker-compose -f jenkins-compose.yml down -v

<a name="dguk7"></a>

### 二、Jenkins 自动打包部署配置

<br />   项目部署有多种方式，从最原始的可运行 jar 包直接部署到 JDK 环境下运行，到将可运行的 jar 包放到 docker 容器中运行，再到现在比较流行的把可运行的 jar 包和 docker 放到 k8s 的 pod 环境中运行。每一种新的部署方式都是对原有部署方式的改进和优化，这里不着重介绍每种方式的优缺点，只简单说明一下使用 Kubernetes 的原因：Kubernetes 主要提供弹性伸缩、服务发现、自我修复，版本回退、负载均衡、存储编排等功能。<br />   日常开发部署过程中的基本步骤如下：

- 提交代码到 gitlab 代码仓库
- gitlab 通过 webhook 触发 Jenkins 构建代码质量检查
- Jenkins 需通过手动触发，来拉取代码、编译、打包、构建 Docker 镜像、发布到私有镜像仓库 Harbor、执行 kubectl 命令从 Harbor 拉取 Docker 镜像部署至 k8s

<a name="bAcp1"></a>

### 1. 安装插件

&emsp;&emsp;安装[Kubernetes plugin](https://plugins.jenkins.io/kubernetes)插件、[Git Parameter](https://plugins.jenkins.io/git-parameter)插件（用于流水线参数化构建）、[Extended Choice Parameter](https://plugins.jenkins.io/extended-choice-parameter)插件（用于多个微服务时，选择需要构建的微服务）、 [Pipeline Utility Steps](https://plugins.jenkins.io/pipeline-utility-steps)插件（用于读取 maven 工程的.yaml、pom.xml 等）和 [Kubernetes Continuous Deploy](https://plugins.jenkins.io/kubernetes-cd)（一定要使用 1.0 版本，从[官网](https://plugins.jenkins.io/kubernetes-cd/#releases)下载然后上传） ，Jenkins --> 系统管理 --> 插件管理 --> 可选插件 --> Kubernetes plugin /Git Parameter/Extended Choice Parameter ,选中后点击 Install without restart 按钮进行安装

![](https://cdn.gitegg.com/cloud/docs/images/20211220182401.png#id=fWeAX&originHeight=75&originWidth=1207&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://cdn.gitegg.com/cloud/docs/images/20211220182418.png#id=LNMTj&originHeight=81&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://cdn.gitegg.com/cloud/docs/images/20211220182428.png#id=qu6Hq&originHeight=100&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](https://cdn.gitegg.com/cloud/docs/images/20211220182439.png#id=TCDOu&originHeight=656&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

Blueocean 目前还不支持 Git Parameter 插件和 Extended Choice Parameter 插件，Git Parameter 是通过 Git Plugin 读取分支信息，我们这里使用 Pipeline script 而不是使用 Pipeline script from SCM，是因为我们不希望把构建信息放到代码里，这样做可以开发和部署分离。

<a name="e73PB"></a>

### 2. 配置插件

&emsp;&emsp;配置[Kubernetes plugin](https://plugins.jenkins.io/kubernetes)插件，Jenkins --> 系统管理 --> 节点管理 --> Configure Clouds -->  Add a new cloud -> Kubernetes<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182452.png#id=YmXv4&originHeight=552&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="BDdzn"></a>

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

系统管理-->凭据-->系统-->全局凭据<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182505.png#id=V5RBp&originHeight=478&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="PSbcN"></a>

### 4. 添加访问 Kubernetes 的凭据信息，这里填入上面登录 Kubernetes Dashboard 所创建的 token 即可，添加完成之后选择刚刚添加的凭据，然后点击连接测试，如果提示连接成功，那么说明我们的 Jenkins 可以连接 Kubernetes 了

![](https://cdn.gitegg.com/cloud/docs/images/20211220182518.png#id=bdEe7&originHeight=609&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182531.png#id=iK50h&originHeight=222&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br /><br />

<a name="TCkpm"></a>

### 5. jenkins 全局配置 jdk、git 和 maven，jenkinsci/blueocean 镜像默认安装了 jdk 和 git，这里需要登录容器找到路径，然后配置进去。通过命令进入 jenkins 容器，并查看 JAVA_HOEM 和 git 路径：

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

通过命令查询可知，JAVA_HOME=/opt/java/openjdk    GIT= /usr/bin/git ， 在 Jenkins 全局工具配置中配置<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182543.png#id=thKuc&originHeight=616&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />Maven 可以在宿主机映射的/data/docker/ci/jenkins/home 中安装，然后配置时，配置容器路径为/var/jenkins_home 下的 Maven 安装路径<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182556.png#id=Rs3vp&originHeight=291&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br />在系统配置中设置 MAVEN_HOME 供 Pipeline script 调用，如果执行脚本时提示没有权限，那么在宿主 Maven 目录的 bin 目录下执行 chmod 777 \*<br />![](https://cdn.gitegg.com/cloud/docs/images/20211220182613.png#id=oJeJq&originHeight=367&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="iBrbA"></a>

### 6. 为 k8s 新建 harbor-key，用于 k8s 拉取私服镜像，配置在代码的 k8s-deployment.yml 中使用。

```
kubectl create secret docker-registry harbor-key --docker-server=172.16.20.175 --docker-username='robot$gitegg' --docker-password='Jqazyv7vvZiL6TXuNcv7TrZeRdL8U9n3'
```

<a name="Fzq86"></a>

### 7. 新建 pipeline 流水线任务

![](https://cdn.gitegg.com/cloud/docs/images/20211220182639.png#id=ijZ6i&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)<br /><br />

<a name="NPZoj"></a>

### 8. 配置流水线任务参数

![](https://cdn.gitegg.com/cloud/docs/images/20211220182650.png#id=p6UAl&originHeight=4396&originWidth=1056&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="dxCXy"></a>

### 9. 配置 pipeline 发布脚本

在流水线下面选择 Pipeline script

![](https://cdn.gitegg.com/cloud/docs/images/20211220182702.png#id=mvB99&originHeight=509&originWidth=777&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

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
