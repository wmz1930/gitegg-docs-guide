---
title: 三、实现 OpenFeign 微服务调用客户端
icon: app
order: 3
category:
  - 二次开发
tag:
  - 二次开发
  - 开发
  - 使用
  - OpenFeign
---

&emsp;&emsp;我们将示例中的微服务分为商品微服务，订单微服务，支付微服务，账户微服务，传统单体应用的服务调用方式，是定义接口，然后想调用查询商品信息就注入商品相关接口，想调用支付服务，就注入支付相关接口。微服务的架构下就不能使用直接注入接口的方式来调用了，微服务之间可以通过使用 OpenFeign 来实现服务接口的相互调用，并且 OpenFeign 可以像我们通常使用的注入接口方式来使用。<br />  OpenFeign 可以使消费者将提供者提供的服务名伪装为接口进行消费，消费者只需使用“Service 接口+ 注解”的方式。即可直接调用 Service 接口方法，而无需再使用 RestTemplate 了。其实原理还是使用 RestTemplate，而通过 OpenFeign 伪装成我们熟悉的习惯。

### 1. 在 gitegg-mall-goods-client 中新建 Feign 接口定义，通过商品 id 获取商品详情信息

```
/**
 * 商品相关服务feign
 * 添加contextId用于区分相同name的client，否则会报错
 * @author GitEgg
 */
@FeignClient(name = "gitegg-mall-goods", contextId = "MallGoodsClient")
public interface IMallGoodsFeign {

    /**
     * 根据商品id列表查询商品信息列表
     *
     * @param ids
     * @return
     */
    @GetMapping("/feign/mall/goods/query/by/ids")
    Result<Object> queryByIds(@RequestParam("ids") List<Long> ids);

}
```

### 2. 在 gitegg-mall-goods 中新建通过商品 id 获取商品详情信息服务的 Feign 接口实现,通过代码可以看出来 Feign 的接口实现实际是一个 controller 接口。

```
/**
 * @ClassName: GoodsFeign
 * @Description: GoodsFeign前端控制器
 * @author GitEgg
 */
@RestController
@RequestMapping(value = "/feign/mall/goods")
@RequiredArgsConstructor(onConstructor_ = @Autowired)
@Api(value = "MallGoodsFeign|提供微服务调用接口")
public class MallGoodsFeign {

    private final IGoodsService goodsService;

    @GetMapping(value = "/query/by/ids")
    @ApiOperation(value = "通过商品id列表查询商品信息", notes = "通过商品id列表查询商品信息")
    public Result<?> queryGoodsByIds(@RequestParam("ids") List<Long> ids) {
        List<GoodsSku> goodsSkuList = goodsService.queryGoodsByIds(ids);
        return Result.data(goodsSkuList);
    }
}
```

### 3. 模拟在订单微服务中调用商品微服务查询接口

```
......
// 注入IMallGoodsFeign
private final IMallGoodsFeign mallGoodsFeign;
......
// 接口调用，获取商品的详细信息
Result<Object> goodsSkuResult = mallGoodsFeign.queryByIds(orderSkuList.stream()
                .map(OrderSkuDTO::getGoodsSkuId)
                .collect(Collectors.toList()));
......
```

### 4. 上面微服务接口调用及建立好了，更多使用功能及测试，可以使用 gitegg-cloud 框架本身自带的 gitegg-service 和 gitegg-service-client 模块，里面有完整的使用示例。OpenFeign 建立好的目录结构如下：<br />![](http://img.gitegg.com/cloud/docs/images/20211116223102.png#id=vK1Zw&originHeight=942&originWidth=1392&originalType=binary&ratio=1&status=done&style=none)
