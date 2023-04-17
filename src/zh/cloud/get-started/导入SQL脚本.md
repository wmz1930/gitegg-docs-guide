---
title: 二、导入SQL脚本
icon: mysql
order: 3
category:
  - 快速开始
tag:
  - 快速开始
  - 安装
  - SQL
---

<a name="68cbe243"></a>

### 1. 数据库建表脚本放在 GitEgg -> Document -> sql 目录下，这里使用 Navicat 说明如何导入数据库建表脚本，初始化数据库，打开 Navicat，新建 Mysql 连接

![](https://cdn.gitegg.com/cloud/docs/images/navicat_open.png#id=M9Dpm&originHeight=410&originWidth=472&originalType=binary&ratio=1&status=done&style=none)

<a name="8d6ed34e"></a>

### 2. 输入环境搭建时创建的数据库地址和用户名密码

![](https://cdn.gitegg.com/cloud/docs/images/navicat_connect.png#id=OKW3o&originHeight=669&originWidth=566&originalType=binary&ratio=1&status=done&style=none)

<a name="58c12e3f"></a>

### 3. 连接成功之后，在 Navicat 左侧会出现我们的数据库连接，上数据库连接上点击右键，选择新建数据库,填写数据库名，字符集和排序规则

![](https://cdn.gitegg.com/cloud/docs/images/db_new.png#id=uVwxj&originHeight=393&originWidth=443&originalType=binary&ratio=1&status=done&style=none)

<a name="35aef00c"></a>

### 4. 在我们刚刚新建的数据库 gitegg_cloud 上双击打开数据库，然后点击右键选择“运行 SQL 文件...”

![](https://cdn.gitegg.com/cloud/docs/images/sql_important.png#id=N3VT8&originHeight=315&originWidth=325&originalType=binary&ratio=1&status=done&style=none)

<a name="c5d7241a"></a>

### 5. 在弹出的 sql 脚本文件选择窗口中，只要选择 gitegg_cloud.sql 文件即可，请注意，不要选择其他文件，其他文件是用来测试数据库多数据源、分库分表及分布式事务的。

![](https://cdn.gitegg.com/cloud/docs/images/sql_choose.png#id=JlyXC&originHeight=363&originWidth=765&originalType=binary&ratio=1&status=done&style=none)

<a name="17dc76eb"></a>

### 6. 出现以下界面，表明数据库建表脚本已经成功执行，GitEgg 所需的基本数据库已创建完成。

![](https://cdn.gitegg.com/cloud/docs/images/sql_success.png#id=inu7V&originHeight=352&originWidth=404&originalType=binary&ratio=1&status=done&style=none)
