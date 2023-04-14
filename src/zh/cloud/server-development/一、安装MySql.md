---
title: 一、安装MySql
icon: mysql
order: 1
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - MySql
---

&emsp;&emsp;这里介绍在 CentOS7 上通过安装通用预编译包方式安装 MySql 数据库：

<a name="b7850808"></a>

### 1. 增加用户名和用户组 ：

```
#groupadd mysql
#useradd -r -g mysql mysql  ---新建msyql 用户禁止登录shell
```

<a name="c789c6d5"></a>

### 2. 下载、解压 MySQL 通用编译包：

```
#wget ftp://ftp.mirrorservice.org/sites/ftp.mysql.com/Downloads/MySQL-5.7/mysql-5.7.11-linux-glibc2.5-x86_64.tar.gz
#cd /usr/local/     ---切换到存放源码包所在目录（这里也是安装目录）
#tar -xvf mysql-5.7.11-linux-glibc2.5-x86_64.tar.gz  ---在当前目录解压通用编译包
#ln -s /usr/local/mysql-5.7.11-linux-glibc2.5-x86_64.tar.gz mysql ---建立软链接mysql 方便操作
```

<a name="f3e67d66"></a>

### 3.   设置权限并初始化 MySQL 系统授权表：

```
#cd mysql ---进入软链接目录
#mkdir /usr/local/mysql/data  ---新建数据目录
#chmod 770 /usr/local/mysql/data ---更改data目录权限为770
#chown -R mysql. ---更改所有者，注意是mysql.
#chgrp -R mysql.  ---更改所属组，注意是mysql.
#bin/mysqld —initialize -user=mysql -basedir=/usr/local/mysql --datadir=/usr/local/mysql/data ---以root 初始化操作时要加--user=mysql参数，生成一个随机的密码（保存登录时使用）
#chown -R root. ---更改所有者，注意是root.
#chown -R mysql /usr/local/mysql/data ---更改data目录所有者为mysql
```

<a name="ff6529a1"></a>

### 4.   创建配置文件并后台启动 MySQL

```
# mv/etc/my.cnf /etc/my.cnf.bak      ---my.cnf 改名或删除（默认的my.cnf 会影响mysql 启动）
#cd /usr/local/mysql/support-files  ---进入MySQL 安装目录支持文件目录
#cp my-default.cnf/etc/my.cnf ---复制模板为新的配置文件，根据需要修改文件中配置选 项如不修改配置MySQL则按默认配置参数运行。
#/usr/local/mysql/bin/mysqld_safe --user=mysql &    ---后台启动mysql
```

<a name="61e2b629"></a>

### 5.   配置 MySQL 自动启动

```
#cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysql ---复制启动文件
#chmod 755 /etc/init.d/mysql ---增加执行权限
#chkconfig -add mysql  ---加入自动启动项
#chkconfig --level 345 mysql on ---设置MySQL 在345 等级自动启动  ***把服务文件放到/etc/init.d/目录下面相当于改为了rpm包安装的服务使用方式。
```

<a name="7d01f4b3"></a>

### 6.   配置 MySQL 系统环境变量

```
#vi /etc/profile  ---编辑/etc/profile文件在最后添加如下两行：
PATH=/usr/local/mysql/bin:$PATH
export PATH  ---不加登录mysql 时会报错“-bash: mysql: command not found”
#source /etc/profile  ---使环境变量及时生效
```

<a name="ccec1b48"></a>

### 7.   启动 MySQL 服务

```
#/usr/local/mysql/support-files/mysql.server start ---启动mysql服务
#/usr/local/mysql/support-files/mysql.server restart ---重启mysql
#/usr/local/mysql/support-files/mysql.server stop  ---停止mysql服务
```

_也可以用 service mysql start 或 systemctl start mysql 这样的 rpm 服务命令，还可以使用绝对路径/etc/init.d/mysql start 来启动 mysql，因为上面已经把启动方式改为了 rpm 服务启动方式。_

<a name="203b632f"></a>

### 8.   访问 MySQL 数据库

```
#mysql -u root-p  ---连接mysql，输入初始化时生成的密码
mysql> alter user 'root^'localhost' identified by '123456';  ---修改root 新密码
mysql> quit; ---退出也可用exit;
# mysql -u root -p  ---提示输入密码时输入新设置的密码登录
mysql>use mysql;  ---访问数据库mysql
mysql>GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION; ---创建可以远程链接的用户
```

<a name="7ebcf283"></a>

### 9.   创建 SSL/RSA 文件

```
#cd /usr/local/mysql/bin ---切换目录
#mysql_ssl_rsa_setup -user=mysql -basedir=/usr/local/mysql --datadir=/usr/local/mysql/data  ---创建新的SSL文件
```

<a name="83b10e56"></a>

### 10.  MySQL 默认区分大小写，需要修改配置文件使其不区分大小写

在/etc/my.cnf 中的[mysqld]后加入下面一行，并重启 MySQL

```
lower_case_table_names=1
```

<a name="84ed15c2"></a>

### 11、常见问题及解决方式：

a、登录时报错

```
#myslq -u root -p
报错：  ERROR 1045 (28000):
Access denied for user 'root'local host' (using password: NO)---(不输入密码时）ERROR 1045 (28000):
Access denied for user ,root,@,localhost, (using password: YES)---(输入密码时）
```

解决方式:

```
#/etc/init.d/mysql stop  ---停止mysql 服务
#mysqld_safe -skip-grant-tables -skip-networking &  ---跳过权限表控制，跳过TCP/IP 协议在本机访问
#mysql -u root -p mysql  ---提示输入密码时直接到 7 丨（
mysql>update user set authentication_string=password('123456,) where user='root'; --修改密码，在 MySQL5.7.9中密码字段名是authentication_string 而不是原来的password 了。
mysql> flush privileges; ---刷新MySQL的系统权限相关表使其生效
mysql> quit;  ---退出mysql
#/etc/init.d/mysqld restart  ---重启mysql 服务
```

b、访问数据库时报错

```
#myslq -u root -p ---提示输入密码时输入新设置的密码
mysql>use mysql;
报错：  ERROR 1820 (HY000): You must SET PASSWORD before executing this statement
```

解决方式：

```
mysql>alteruseruser() identifiedby '123456'; ---再重新设置下密码，注意方法与之前5.6版本的“SET  PASSWORD = PASSWORD('new_password'}/MH
```

c、启动 MySQL 服务报错

```
#systemctl start mysql
报错：  Starting MySQL.. ERROR! The server quit without updating PID file (/usr/local/mysql/data/localhost.localdomain.pid).
```

解决方式：

```
初始化没有指定路径参数造成的加上参数即可
#cd /usr/local/mysql
#bin/mysqld -initialize-user=mysql -basedir=/usr/local/mysql -datadir=/usr/local/mysql/data
```

d、使用 druid 作为数据库连接池时，密码加密（找到 maven 目录下的 druid 包）

```
java -cp druid-1.0.14.jar com.alibaba.druid.filter.config.ConfigTools you_password
```
