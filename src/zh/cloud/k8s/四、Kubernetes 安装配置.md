---
title: 四、Kubernetes 安装配置
icon: symbol
order: 4
category:
  - 持续集成
tag:
  - 持续集成
  - K8S
  - 集群
  - CI
  - CD
---

<a name="8eb1bbc9"></a>

### 1、切换镜像源

```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```

<a name="9cad35dd"></a>

### 2、安装 kubeadm、kubelet 和 kubectl

```
yum install -y kubelet kubeadm kubectl
```

<a name="b19762e6"></a>

### 3、配置 kubelet 的 cgroup

```
vi  /etc/sysconfig/kubelet
```

```
KUBELET_CGROUP_ARGS="--cgroup-driver=systemd"
KUBE_PROXY_MODE="ipvs"
```

<a name="fb5bf8aa"></a>

### 4、启动 kubelet 并设置开机启动

```
systemctl start kubelet && systemctl enable kubelet
```

<a name="5a2e37c6"></a>

### 5、初始化 k8s 集群（只在 Master 执行）

初始化

```
kubeadm init --kubernetes-version=v1.22.3  \
--apiserver-advertise-address=172.16.20.111   \
--image-repository registry.aliyuncs.com/google_containers  \
--service-cidr=10.20.0.0/16 --pod-network-cidr=10.222.0.0/16
```

![](http://img.gitegg.com/cloud/docs/images/20211221102314.png#id=YOKy6&originHeight=425&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

创建必要文件

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

<a name="47c51d6a"></a>

### 6、加入集群（只在 Node 节点执行）

在 Node 节点（172.16.20.112 和 172.16.20.113）运行上一步初始化成功后显示的加入集群命令

```
kubeadm join 172.16.20.111:6443 --token fgf380.einr7if1eb838mpe \
	--discovery-token-ca-cert-hash sha256:fa5a6a2ff8996b09effbf599aac70505b49f35c5bca610d6b5511886383878f7
```

在 Master 查看集群状态

```
[root@master ~]# kubectl get nodes
NAME     STATUS     ROLES                  AGE     VERSION
master   NotReady   control-plane,master   2m54s   v1.22.3
node1    NotReady   <none>                 68s     v1.22.3
node2    NotReady   <none>                 30s     v1.22.3
```

<a name="d3cec403"></a>

### 7、安装网络插件（只在 Master 执行）

```
wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
```

镜像加速：修改 kube-flannel.yml 文件，将 quay.io/coreos/flannel:v0.15.0 改为 quay.mirrors.ustc.edu.cn/coreos/flannel:v0.15.0<br />执行安装

```
kubectl apply -f kube-flannel.yml
```

再次查看集群状态,（需要等待一段时间大概 1-2 分钟）发现 STATUS 都是 Ready。

```
[root@master ~]# kubectl get nodes
NAME     STATUS   ROLES                  AGE   VERSION
master   Ready    control-plane,master   42m   v1.22.3
node1    Ready    <none>                 40m   v1.22.3
node2    Ready    <none>                 39m   v1.22.3
```

<a name="0b078c7a"></a>

### 8、集群测试

使用 kubectl 安装部署 nginx 服务

```
kubectl create deployment nginx  --image=nginx  --replicas=1

kubectl expose deploy nginx  --port=80 --target-port=80  --type=NodePort
```

查看服务

```
[root@master ~]# kubectl get pod,svc
NAME                         READY   STATUS    RESTARTS   AGE
pod/nginx-6799fc88d8-z5tm8   1/1     Running   0          26s

NAME                 TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)        AGE
service/kubernetes   ClusterIP   10.20.0.1      <none>        443/TCP        68m
service/nginx        NodePort    10.20.17.199   <none>        80:32605/TCP 9s
```

服务显示 service/nginx 的 PORT(S)为 80:32605/TCP， 我们在浏览器中访问主从地址的 32605 端口，查看 nginx 是否运行<br />[http://172.16.20.111:32605/](http://172.16.20.111:32605/)<br />[http://172.16.20.112:32605/](http://172.16.20.112:32605/)<br />[http://172.16.20.113:32605/](http://172.16.20.113:32605/)<br />成功后显示如下界面：<br />![](http://img.gitegg.com/cloud/docs/images/20211221102334.png#id=xtVIU&originHeight=305&originWidth=935&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

<a name="fcccc438"></a>
