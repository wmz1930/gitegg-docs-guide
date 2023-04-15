import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { searchProPlugin } from "vuepress-plugin-search-pro";

export default defineUserConfig({
  base: "/",
  lang: "zh-CN",
  locales: {
    "/": {
      lang: "zh-CN",
      title: "GitEgg",
      description: "GitEgg是一款开源免费的企业级分布式微服务应用开发框架，旨在整合目前主流稳定的开源技术框架，集成常用的最佳项目解决方案，实现可直接使用的微服务快速开发框架。",
    },
    // "/en/": {
    //   lang: "en-US",
    //   title: "GitEgg",
    //   description: "A docs demo for vuepress-theme-hope",
    // },
  },

  theme,
  head: [
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?bea3bd54110091405e4ebcb074f6242e";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
      })();
      `,
    ],
  ],
  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: true,
      // 为分类和标签添加索引
      customFields: [
        {
          getter: (page) => page.frontmatter.category,
          formatter: "分类：$content",
        },
        {
          getter: (page) => page.frontmatter.tag,
          formatter: "标签：$content",
        },
      ],
    }),
  ],
  // Enable it with pwa
  // shouldPrefetch: false,
});
