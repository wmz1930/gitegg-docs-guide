import { sidebar } from "vuepress-theme-hope";

export const zhSidebar = sidebar({
  "/zh/": [
    {
      text: "GitEgg-Cloud指南",
      icon: "note",
      link: "/zh/cloud/",
    },
    {
      text: "GitEgg-Boot指南",
      icon: "note",
      link: "/zh/boot",
    },
    {
      text: "前端教程",
      icon: "note",
      link: "/zh/vue",
    },
    {
      text: "功能配置",
      icon: "note",
      link: "/zh/config",
    },
    {
      text: "技能拓展",
      icon: "note",
      link: "/zh/advanced",
    },
    {
      text: "常见问题",
      icon: "note",
      link: "/zh/question",
    },
  ],
  "/zh/cloud/": "structure",
  "/zh/boot/": "structure",
  "/zh/vue": "structure",
  "/zh/config": "structure",
  "/zh/advanced": "structure",
  "/zh/question": "structure",
});
