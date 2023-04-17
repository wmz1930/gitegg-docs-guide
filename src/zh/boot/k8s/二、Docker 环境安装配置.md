---
title: 二、Docker 环境安装配置
icon: symbol
order: 2
category:
  - 持续集成
tag:
  - 持续集成
  - K8S
  - 集群
  - CI
  - CD
---

<a name="M7KqJ"></a>

### 1、安装依赖

docker 依赖于系统的一些必要的工具:

```
yum install -y yum-utils device-mapper-persistent-data lvm2
```

<a name="bb120c32"></a>

### 2、添加软件源

```
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum clean all
yum makecache fast
```

<a name="7a9e8fa6"></a>

### 3、安装 docker-ce

```
#查看可以安装的docker版本
yum list docker-ce --showduplicates
#选择安装需要的版本，直接安装最新版，可以执行 yum -y install docker-ce
yum install --setopt=obsoletes=0 docker-ce-19.03.13-3.el7 -y
```

<a name="15701a23"></a>

### 4、启动服务

```
#通过systemctl启动服务
systemctl start docker
#通过systemctl设置开机启动
systemctl enable docker
```

<a name="0ea9bdfe"></a>

### 5、查看安装版本

启动服务使用 docker version 查看一下当前的版本:

```
docker version
```

<a name="e929c593"></a>

### 6、 配置镜像加速

通过修改 daemon 配置文件/etc/docker/daemon.json 加速，如果使用 k8s，这里一定要设置 "exec-opts": ["native.cgroupdriver=systemd"]。 "insecure-registries" : ["172.16.20.175"]配置是可以通过 http 从我们的 harbor 上拉取数据。

```
vi /etc/docker/daemon.json

{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "registry-mirrors": ["https://eiov0s1n.mirror.aliyuncs.com"],
  "insecure-registries" : ["172.16.20.175"]
}


sudo systemctl daemon-reload && sudo systemctl restart docker
```

<a name="ca763f50"></a>

### 7、安装 docker-compose

如果网速太慢，可以直接到 [https://github.com/docker/compose/releases](https://github.com/docker/compose/releases)   选择对应的版本进行下载，然后上传到服务器/usr/local/bin/目录。

```
sudo curl -L  "https://github.com/docker/compose/releases/download/v2.0.1/docker-compose-$(uname -s)-$(uname -m)"  -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

<a name="908984c8"></a>

### 注意：（非必须设置）开启 Docker 远程访问 (这里不是必须开启的，生产环境不要开启，开启之后，可以在开发环境直连 docker)

```
vi /lib/systemd/system/docker.service
```

修改 ExecStart，添加 -H tcp://0.0.0.0:2375<br />![](https://cdn.gitegg.com/cloud/docs/images/20211221102248.png#id=KE5jn&originHeight=477&originWidth=734&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```
ExecStart=/usr/bin/dockerd -H fd:// -H tcp://0.0.0.0:2375 --containerd=/run/containerd/containerd.sock
```

修改后执行以下命令：

```
systemctl daemon-reload && service docker restart
```

测试是否能够连得上：

```
curl http://localhost:2375/version
```

![](https://cdn.gitegg.com/cloud/docs/images/20211221102300.png#id=HfhZq&originHeight=140&originWidth=759&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
