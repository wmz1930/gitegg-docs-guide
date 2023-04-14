---
title: 五、Kubernetes Dashboard 安装配置
icon: symbol
order: 5
category:
  - 持续集成
tag:
  - 持续集成
  - K8S
  - 集群
  - CI
  - CD
---

&emsp;&emsp;Kubernetes 可以通过命令行工具 kubectl 完成所需要的操作，同时也提供了方便操作的管理控制界面，用户可以用 Kubernetes Dashboard 部署容器化的应用、监控应用的状态、执行故障排查任务以及管理 Kubernetes 各种资源。

<a name="5eb27ef1"></a>

### 1、下载安装配置文件 recommended.yaml ,注意在https://github.com/kubernetes/dashboard/releases查看Kubernetes 和 Kubernetes Dashboard 的版本对应关系。

![](http://img.gitegg.com/cloud/docs/images/20211221102446.png#id=QLUGR&originHeight=766&originWidth=1152&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

```
# 执行下载
wget https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml
```

<a name="ba7f3e31"></a>

### 2、修改配置信息，在 service 下添加 type: NodePort 和 nodePort: 30010

```
vi recommended.yaml
```

```
......
kind: Service
apiVersion: v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  # 新增
  nodeName: Master
  # 新增
  type: NodePort
  ports:
    - port: 443
      targetPort: 8443
      # 新增
      nodePort: 30010
......
```

注释掉以下信息，否则不能安装到 master 服务器

```
      # Comment the following tolerations if Dashboard must not be deployed on master
      #tolerations:
      #   - key: node-role.kubernetes.io/master
      #   effect: NoSchedule
```

新增 nodeName: master，安装到 master 服务器

```
......
kind: Deployment
apiVersion: apps/v1
metadata:
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
spec:
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      k8s-app: kubernetes-dashboard
  template:
    metadata:
      labels:
        k8s-app: kubernetes-dashboard
    spec:
      nodeName: master
      containers:
        - name: kubernetes-dashboard
          image: kubernetesui/dashboard:v2.4.0
          imagePullPolicy: Always
......
```

<a name="26db6c38"></a>

### 3、执行安装部署命令

```
kubectl apply -f recommended.yaml
```

<a name="4b4615a1"></a>

### 4、查看运行状态命令，可以看到 service/kubernetes-dashboard 已运行，访问端口为 30010

```
[root@master ~]# kubectl get pod,svc -n kubernetes-dashboard
NAME                                            READY   STATUS              RESTARTS   AGE
pod/dashboard-metrics-scraper-c45b7869d-6k87n   0/1     ContainerCreating   0          10s
pod/kubernetes-dashboard-576cb95f94-zfvc9       0/1     ContainerCreating   0          10s

NAME                                TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)         AGE
service/dashboard-metrics-scraper   ClusterIP   10.20.222.83    <none>        8000/TCP        10s
service/kubernetes-dashboard        NodePort    10.20.201.182   <none>        443:30010/TCP   10s
```

<a name="46253bfe"></a>

### 5、创建访问 Kubernetes Dashboard 的账号

```
kubectl create serviceaccount dashboard-admin -n kubernetes-dashboard

kubectl create clusterrolebinding dashboard-admin-rb --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:dashboard-admin
```

<a name="af06e8ff"></a>

### 6、查询访问 Kubernetes Dashboard 的 token

```
[root@master ~]# kubectl get secrets -n kubernetes-dashboard | grep dashboard-admin
dashboard-admin-token-84gg6        kubernetes.io/service-account-token   3      64s
[root@master ~]# kubectl describe secrets dashboard-admin-token-84gg6 -n kubernetes-dashboard
Name:         dashboard-admin-token-84gg6
Namespace:    kubernetes-dashboard
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: dashboard-admin
              kubernetes.io/service-account.uid: 2d93a589-6b0b-4ed6-adc3-9a2eeb5d1311

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1099 bytes
namespace:  20 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6ImRmbVVfRy15QzdfUUF4ZmFuREZMc3dvd0IxQ3ItZm5SdHVZRVhXV3JpZGcifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlcm5ldGVzLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJkYXNoYm9hcmQtYWRtaW4tdG9rZW4tODRnZzYiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoiZGFzaGJvYXJkLWFkbWluIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY291bnQudWlkIjoiMmQ5M2E1ODktNmIwYi00ZWQ2LWFkYzMtOWEyZWViNWQxMzExIiwic3ViIjoic3lzdGVtOnNlcnZpY2VhY2NvdW50Omt1YmVybmV0ZXMtZGFzaGJvYXJkOmRhc2hib2FyZC1hZG1pbiJ9.xsDBLeZdn7IO0Btpb4LlCD1RQ2VYsXXPa-bir91VXIqRrL1BewYAyFfZtxU-8peU8KebaJiRIaUeF813x6WbGG9QKynL1fTARN5XoH-arkBTVlcjHQ5GBziLDE-KU255veVqORF7J5XtB38Ke2n2pi8tnnUUS_bIJpMTF1s-hV0aLlqUzt3PauPmDshtoerz4iafWK0u9oWBASQDPPoE8IWYU1KmSkUNtoGzf0c9vpdlUw4j0UZE4-zSoMF_XkrfQDLD32LrG56Wgpr6E8SeipKRfgXvx7ExD54b8Lq9DyAltr_nQVvRicIEiQGdbeCu9dwzGyhg-cDucULTx7TUgA
```

<a name="43478d02"></a>

### 7、在页面访问 Kubernetes Dashboard，注意一定要使用 https，[https://172.16.20.111:30010](https://172.16.20.111:30010) ，输入 token 登录成功后就进入了后台管理界面，原先命令行的操作就可以在管理界面进操作了

![](http://img.gitegg.com/cloud/docs/images/20211221102500.png#id=vdZQ8&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

![](http://img.gitegg.com/cloud/docs/images/20211221102514.png#id=VIQNW&originHeight=605&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
