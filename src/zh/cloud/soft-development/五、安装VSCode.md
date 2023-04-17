---
title: 五、安装VSCode
icon: vscode
order: 5
category:
  - 环境准备
tag:
  - 环境准备
  - 安装
  - 使用
  - 安装VSCode
---

&emsp;&emsp;[Visual Studio Code](https://code.visualstudio.com/) (简称  **VSCode** / **VSC**) 是一款免费开源的现代化轻量级代码编辑器，支持几乎所有主流的开发语言的语法高亮、智能代码补全、自定义热键、括号匹配、代码片段、代码对比 Diff、Git  等特性，支持插件扩展，并针对网页开发和云端应用开发做了优化。

<a name="7f906bb8"></a>

### 1. 下载合适的 VSCode 安装包，[下载地址](https://code.visualstudio.com/Download)

![](https://cdn.gitegg.com/cloud/docs/images/vscode1.png#id=qRs25&originHeight=936&originWidth=1166&originalType=binary&ratio=1&status=done&style=none)

<a name="7bf731fb"></a>

### 2. 我们这里选择的是.zip 解压版，下载解压后就可使用。

<a name="725f6f22"></a>

### 3. 安装插件，打开 VSCode，点击左侧下面的扩展按钮，选择需要的插件进行安装

汉化插件：  Chinese (Simplified) Language Pack for Visual Studio Code

代码检查/格式化工具：  ESLint

Html/js/css 进行格式化对齐显示:     Beautify

Vue 开发工具 :   Vetur

<a name="ec304ace"></a>

### 4. 配置 ESLint 自动检测格式化前端代码

在我们使用的前端框架中，已经生成 eslint 相关的配置文件.eslintignore 和.eslintrc.js，当我们编辑代码保存时，ESlint 插件会将我们的代码自动按照配置好的格式进行格式化，这里介绍在 VSCode 中如何配置使用 Eslint。<br />修改 VSCode 配置，文件->首选项->设置，在设置页,点击右上角第一个按钮，打开 setting.json，修改内容为：

```
{
    //保存自动格式化
    "editor.formatOnSave": true,
    //autoFixedOnSave 设置已废弃，采用如下新的设置
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    //.vue文件template格式化支持，并使用js-beautify-html插件
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    // js-beautify-html格式化配置，属性强制换行
    "vetur.format.defaultFormatterOptions": {
        "js-beautify-html": {
            "wrap_attributes": "force-aligned"
        }
    },
    //后面不添加逗号
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    //方法后面加空格
    "javascript.format.insertSpaceBeforeFunctionParenthesis": true,
    "files.autoSave": "off",
    "eslint.format.enable": true,
    //autoFix默认开启，只需输入字符串数组即可
    "eslint.validate": [
        "javascript",
        "javascriptreact",
        "vue",
        "html",
        "vue-html"
    ],
    "eslint.run": "onSave"
}
```
