---
title: 五、Docker安装Seata
icon: stack
order: 5
category:
  - 持续集成
tag:
  - 持续集成
  - Docker
  - Seata
  - CI
  - CD
---

```bash
docker pull redis

docker run -d --name redis --restart always -p 6379:6379 -v /usr/local/redis/config:/etc/redis -v /usr/local/redis/data:/data redis redis-server /etc/redis/redis.conf --requirepass "123456" --appendonly yes

docker exec -it redis /bin/bash
```
