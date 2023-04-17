---
title: 一、获取access_token
icon: symbol
order: 1
category:
  - 后台
tag:
  - 后台
  - token
  - 登录
---

在我们实际应用接口的调用调试过程中，需要用到 token 或者刷新 token，GitEgg 支持 OAuth2.0 协议进行认证授权，这里介绍说明如何通过 Postman 获取 token 和 refresh_token 并进行接口调试。
<a name="434f829e"></a>

### 1. 使用密码模式获取 token

根据 spring-security-oauth2 的实现，进行密码模式验证时，需要验证客户端的用户名密码，其中有两种方式，一种是将客户端的 client_Id 和 client_secret 放到请求参数中，一种是将 client_Id 和 client_secret 通过 BASE64 加密后放到 Headers 里进行 Basic 验证，我们这里采取第二种方式。

- 首先将 client_Id:client_secret 进行 BASE64 加密，在线 BASE64 工具 [https://www.qvdv.com/tools/qvdv-base64.html](https://www.qvdv.com/tools/qvdv-base64.html)

![](https://cdn.gitegg.com/cloud/docs/images/20220505143859.png#id=DiTv5&originHeight=484&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- 将账号密码的密码进行 MD5 加密，在线 MD5 工具[https://www.qvdv.com/tools/qvdv-md5.html](https://www.qvdv.com/tools/qvdv-md5.html)

![](https://cdn.gitegg.com/cloud/docs/images/20220505143915.png#id=swqqh&originHeight=486&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)

- Postman 设置 Headers 参数

![](https://cdn.gitegg.com/cloud/docs/images/20220505143936.png#id=TaUEQ&originHeight=177&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="16bbe721"></a>

#### 参数列表：

Content-Type: application/x-www-form-urlencoded<br />TenantId: 0<br />Authorization: Basic Z2l0ZWdnLWFkbWluOjEyMzQ1Ng==
<a name="ef99f521"></a>

#### 参数说明：

Content-Type： 设置为表单方式提交<br />TenantId: 开启多租户时，需设置租户 id<br />Authorization：需填写 BASE64 编码后的 client_Id:client_secret，再加 Basic 前缀，让 OAuth2 知道这是 Basic 认证

- Postman 设置 body 参数

![](https://cdn.gitegg.com/cloud/docs/images/20220505144003.png#id=it4P6&originHeight=204&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="16bbe721-1"></a>

#### 参数列表：

grant_type: password<br />username: admin<br />password: 25d55ad283aa400af464c76d713c07ad
<a name="ef99f521-1"></a>

#### 参数说明：

grant_type 表示使用密码模式换取 token<br />username 是换取 token 的用户名<br />password 是换取 token 的密码，此密码同样需要使用 md5 加密

- Postman 设置 POST 请求 token 的 url 为 [http://127.0.0.1/gitegg-oauth/oauth/token<br />](http://127.0.0.1/gitegg-oauth/oauth/token) ,点击 send 按钮，就会获取到后台返回的 token 和 refresh_token<br />![](https://cdn.gitegg.com/cloud/docs/images/20220505144022.png#id=n4o3A&originHeight=531&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
  <a name="a337e737"></a>

### 2. 使用获取到的 token 请求个人用户信息

- Postman 设置获取个人信息的 Headers 参数

将上一步骤中获取到的 token 前面加 Bearer 设置为 Authorization 的值，注意 Bearer 后面有个空格。Bearer 表示此 token 为 Bearer token 后台会根据前缀进行区分是 Basic 还是 Bearer 从而进行不同的认证。设置 GET 请求个人信息的 url 为 [http://127.0.0.1/gitegg-oauth/oauth/user/info<br />](http://127.0.0.1/gitegg-oauth/oauth/user/info) ,点击 send 按钮，就会获取到后台返回的个人信息。<br />![](https://cdn.gitegg.com/cloud/docs/images/20220505144037.png#id=C2Ram&originHeight=391&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="16bbe721-2"></a>

#### 参数列表：

Authorization:

```
Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlSWRMaXN0IjpbIjIiXSwidXNlcl9uYW1lIjoiYWRtaW4iLCJjbGllbnRfaWQiOiJnaXRlZ2ctYWRtaW4iLCJvcmdhbml6YXRpb25JZCI6MSwib3JnYW5pemF0aW9uTmFtZXMiOm51bGwsIm9yZ2FuaXphdGlvbklkcyI6bnVsbCwic2NvcGUiOlsiYWxsIl0sIm5pY2tuYW1lIjoi566h55CG5ZGYIiwib3JnYW5pemF0aW9uSWRMaXN0IjpudWxsLCJvYXV0aF9pZCI6bnVsbCwiaWQiOjEsImV4cCI6MTY1MTczMzk5OCwianRpIjoiNzA5ZTkxYzktNzg3ZS00ZGM5LTkyMzMtNjJlYTYxOTVhMDQxIiwib3JnYW5pemF0aW9uTmFtZSI6IuaciemZkOWFrOWPuCIsInJvbGVJZCI6bnVsbCwiYXZhdGFyIjoiaHR0cHM6Ly93cGltZy53YWxsc3Rjbi5jb20vZjc3ODczOGMtZTRmOC00ODcwLWI2MzQtNTY3MDNiNGFjYWZlLmdpZiIsImF1dGhvcml0aWVzIjpbIlNZU0FETUlOIl0sInJlYWxOYW1lIjoi566h55CG5ZGYIiwicm9sZUlkcyI6IjIiLCJkYXRhUGVybWlzc2lvblR5cGVMaXN0IjpbIjMiXSwidGVuYW50SWQiOiIwIiwicm9sZU5hbWUiOm51bGwsInJvbGVLZXlMaXN0IjpbIlNZU0FETUlOIl0sInJvbGVOYW1lcyI6Iuezu-e7n-euoeeQhuWRmCIsImFjY291bnQiOiJhZG1pbiJ9.b1Jvoq6ACVm5rlIrGI8Dh90TIOk2DWTlnqTzve3bUoVjKy4Rc6i6JLqnL80bfgzFu6FtMZOcF8-rwV1q3gXkU1dfS2Lifwl5HnE-Ag8KNN2Xf1UvA9M1O7ZftQLnrLdvCySx4Zwte1xQ_5udfwCFiqn56DPZieM6_FAzQR65Uj-F2DUZ1dZNF4ThH1zeBjrL0D_NBUJZ0R6DU-fjeD5ecfGubWIgZqy5jz8DyHE-YemntoeIKVpkl7D2T9KqZQ38wfzSeK95jnzqkLAxCTDGl7i2gtT7sFZWWJo8JErX5z8EYMkOri2WHz_q7NhiVOnd1F40nNR2Eoim3iLPCdYKaQ
```

TenantId: 0
<a name="ef99f521-2"></a>

#### 参数说明：

Authorization: 获取用户信息的 token，此 token 可以访问该用户下所有能够访问的、需要鉴权的接口。<br />TenantId: 开启多租户时，需设置租户 id
<a name="a91205f5"></a>

### 3. 当 token 超时，通过 refresh_token 重新获取 token

RefreshToken（刷新令牌授权模式）和密码授权模式一样都是 OAuth2 授权模式的其中一种，我们通常讲的 token 实际是 access_token，这个 token 的超时时间往往比 refresh_token 的超时时间短，当 access_token 超时之后，我们会通过 refresh_token 进行 access_token 的自动刷新，此操作用户无感知，不需要重新登录，当 refresh_token 超时时，才给用户返回登录超时提示。

- 设置 Postman 刷新 token 的参数，因为都是 OAuth2 授权模式的一种，所以认证请求 token 的接口和使用密码模式授权是同一个接口，参数也基本相同，只是在 body 里设置 refresh_token 的值为第一次获取 token 时的 refresh_token
  <a name="e3a9223f"></a>

#### Headers:

![](https://cdn.gitegg.com/cloud/docs/images/20220505144125.png#id=y5YSy&originHeight=174&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="cb5fe242"></a>

#### Body:

![](https://cdn.gitegg.com/cloud/docs/images/20220505144135.png#id=IELOn&originHeight=192&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
<a name="2d1b7b68"></a>

#### 点击 Send 按钮执行请求，获取新的 token 和 refresh_token:

![](https://cdn.gitegg.com/cloud/docs/images/20220505144147.png#id=GkeMU&originHeight=519&originWidth=1240&originalType=binary&ratio=1&rotation=0&showTitle=false&status=done&style=none&title=)
