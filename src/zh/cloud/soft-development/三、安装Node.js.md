---
title: 三、安装Node.js
icon: nodeJS
order: 3
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - Node.js
---

&emsp;&emsp;如果是刚接触 Vue 的话，建议学习一下 vue-element-admin 系列文章，介绍得很详细，虽然 ElementUI 已经不更新了，但是这位前端大神写的文档比 AntDesignVue 文档更加详细、具体、通俗易懂，AntDesignVue 适合掌握一定 Vue 能力的人去使用学习。

<a name="a988dd01"></a>

### 1. Node.js 下载地址：[https://nodejs.org/en/download/releases/](https://nodejs.org/en/download/releases/)

![](https://cdn.gitegg.com/cloud/docs/images/nodejs%E4%B8%8B%E8%BD%BD%E9%A1%B51.png#id=NPqTQ&originHeight=930&originWidth=985&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/nodejs%E4%B8%8B%E8%BD%BD%E9%A1%B52.png#id=iJzAa&originHeight=565&originWidth=683&originalType=binary&ratio=1&status=done&style=none)

<a name="d15b0246"></a>

### 2. 双击安装包，一步步点击下一步即可

![](https://cdn.gitegg.com/cloud/docs/images/node1.png#id=WvjG2&originHeight=386&originWidth=495&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/node2.png#id=mnw22&originHeight=386&originWidth=496&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/node3.png#id=RGwxF&originHeight=386&originWidth=495&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/node4.png#id=X1c9G&originHeight=386&originWidth=495&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/node5.png#id=CH52f&originHeight=387&originWidth=498&originalType=binary&ratio=1&status=done&style=none)<br />![](https://cdn.gitegg.com/cloud/docs/images/node6.png#id=JseAy&originHeight=386&originWidth=494&originalType=binary&ratio=1&status=done&style=none)

<a name="513f39f1"></a>

### 3. 检查是否安装成功

运行 -> cmd 命令窗口 ,在命令行中输入 node -v ，显示 node 版本信息表示安装成功<br />![](https://cdn.gitegg.com/cloud/docs/images/node%E7%89%88%E6%9C%AC.png#id=mEcX4&originHeight=163&originWidth=389&originalType=binary&ratio=1&status=done&style=none)

<a name="0aa11545"></a>

### 4. npm 切换阿里源

命令行中执行如下命令

```
npm config set registry https://registry.npm.taobao.org/
```

<a name="9e03a18a"></a>

### 5. 安装 cnpm

```
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

<a name="df069a5b"></a>

### 6. 安装 yarn

```
npm install -g yarn
yarn config set registry `https://registry.npm.taobao.org -g`
```

这里之所以 cnpm 和 yarn 都安装，是因为其各有优缺点，在使用的时候选择自己习惯的即可。
