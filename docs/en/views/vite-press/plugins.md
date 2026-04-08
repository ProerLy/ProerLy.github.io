---
title: VitePress 文档
layout: doc
---

VitePress 是一个基于 Vue 和 Vite 的静态网站生成器，特别适合用于创建文档网站。通过之前撰写 EasyEditor 的文档经验，我将带你了解 VitePress 的基本使用方法以及一些高级配置技巧。

# 什么是 VitePress？

VitePress 是一个静态站点生成器 (SSG)，专为构建快速、以内容为中心的站点而设计。简而言之，VitePress 获取用 Markdown 编写的内容，对其应用主题，并生成可以轻松部署到任何地方的静态 HTML 页面。

# 快速开始

在这里我们只是介绍 VitePress 的基本实用用法以及一些高级配置技巧。如果你需要更详细的信息，请查看<a target="_blank" href="https://vitepress.dev/guide">VitePress 文档</a>。

## 初始化

在终端中运行以下命令，初始化一个新的 VitePress 项目：

VitePress 可以单独使用，也可以安装到现有项目中。在这两种情况下，都可以使用以下方式安装它：

::: code-group

```sh [npm]
npm add -D vitepress@next
```

```sh [pnpm]
pnpm add -D vitepress@next
```

```sh [yarn]
yarn add -D vitepress@next
```

```sh [bun]
bun add -D vitepress@next
```

:::

在这里我们使用 npm 命令，但 pnpm，yarn 和 bun 也可以。

VitePress 附带一个命令行设置向导，可以帮助你构建一个基本项目。安装后，通过运行以下命令启动向导：

::: code-group

```sh [npm]
npx vitepress init
```

```sh [pnpm]
pnpm vitepress init
```

```sh [yarn]
yarn vitepress init
```

```sh [bun]
bun vitepress init
```

:::

在运行后会出现以下提示：

```npm
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./docs
│
◇  Where should VitePress look for your markdown files?
│  ./docs
│
◇  Site title:
│  My Awesome Project
│
◇  Site description:
│  A VitePress Site
│
◇  Theme:
│  Default Theme
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
◇  Add a prefix for VitePress npm scripts?
│  Yes
│
◇  Prefix for VitePress npm scripts:
│  docs
│
└  Done! Now run pnpm run docs:dev and start writing.
```

这将创建一个名为 `docs` 的文件夹，并在其中生成基础配置文件和示例页面。直接傻瓜式安装

同时，`package.json` 中会自动添加以下脚本命令：

```json
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  }
}
```

## 下载依赖

```npm
npm install
```

## 运行项目

```npm
npm run docs:dev
```

以下是运行后的项目：
<img src="/91a95c327f334d0192dda840432c1757.png" alt="VitePress Run">

# 配置详解

VitePress 的配置文件位于 `.vitepress/config.mts`。下面是一个简单的基础配置示例：

```mts
// .vitepress/config.ts
import { defineConfig } from "vitepress";

// defineConfig 是 VitePress 提供的配置函数
// 用来返回一个 VitePress 配置对象
export default defineConfig({
  // 站点的标题，通常显示在浏览器标签上
  title: "My Docs",
  // 站点的描述，用于 SEO 或浏览器预览
  description: "我的文档网站",
  themeConfig: {
    // 配置网站顶部的导航栏
    nav: [
      // 导航项，包含文字和跳转的链接
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/" },
    ],
    // 配置侧边栏
    sidebar: {
      // 侧边栏的路径和对应的页面链接
      "/guide/": [
        { text: "介绍", link: "/guide/" },
        { text: "快速开始", link: "/guide/getting-started" },
      ],
    },
  },
});
```

## 首页配置

VitePress 提供了内置的首页布局，可以通过 frontmatter 配置。以 EasyEditor 的首页为例：

```md
---
# 配置首页的布局类型
layout: home
# 首页的主标题
title: "EasyEditor: 用于构建可视化应用平台的插件化跨框架低代码引擎"

# hero 是首页的展示区，通常包含项目的名称、简介、图片和操作按钮
hero:
  # hero 区域的主标题
  name: EasyEditor
  # hero 区域的副标题
  text: 低代码引擎
  # hero 区域的描述，用来简短说明产品或项目的特点
  tagline: 用于构建可视化应用平台的插件化跨框架低代码引擎
  # hero 区域的图片，支持 light 和 dark 模式
  image:
    light: /logo.svg # light 模式下显示的 logo
    dark: /logo-dark.svg # dark 模式下显示的 logo
    alt: EasyEditor # 图片的替代文本
  # hero 区域的操作按钮
  actions:
    - theme: brand # 按钮的主题样式
      text: 什么是 EasyEditor？ # 按钮文字
      link: /guide/why # 按钮链接
    - theme: alt
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 参考
      link: /reference/overview

# features 是展示项目特点的部分
features:
  - title: 解耦设计 # 特点的标题
    icon: 🔌 # 特点图标，可以是 emoji 或自定义图标
    details: 引擎核心与框架无关，支持多种框架渲染扩展 # 特点的描述
  - title: 插件化架构
    icon: 🧩
    details: 灵活的插件系统设计，生命周期管理、热键绑定、类扩展机制、依赖注入...
---
```

## 多语言支持

VitePress 支持通过 `locales` 配置实现多语言站点。你可以将公共配置（如 logo、主题插件、搜索配置等）抽离到共享配置文件中，然后根据语言调整具体内容（如 `nav` 和 `sidebar`）。

VitePress 会自动合并 `locales` 下的语言特定配置与顶层配置。只需在子语言配置中填写差异部分。

```mts
import { defineConfig } from "vitepress";

export default defineConfig({
  // 公共配置（可抽离到 shared.ts）

  locales: {
    root: {
      label: "English",
      lang: "en",
    },
    fr: {
      label: "French",
      lang: "fr", // 设置 <html lang="fr">
      link: "/fr/guide", // 显示在语言切换菜单中的链接（默认为 /fr/）

      // 可以添加 fr 特定的 themeConfig、sidebar、nav 等配置
    },
  },
});
```

多语言的目录结构：

**存在 root 配置**时（如英文为默认语言）：

```bash
docs/
├─ fr/
│  └─ foo.md
├─ es/
│  └─ foo.md
├─ foo.md        # 默认语言的页面（root）
```

**没有 root 配置**时（所有语言都在子目录中）：

```bash
docs/
├─ en/
│  ├─ foo.md
├─ es/
│  ├─ foo.md
├─ fr/
   ├─ foo.md
```

## 导航栏配置

导航栏是网站的主要导航方式，可以包含多级菜单：

```javascript
const Nav = [
  {
    text: "指南",
    items: [
      {
        text: "入门指南",
        items: [
          { text: "为什么选择", link: "/guide/why" },
          { text: "快速开始", link: "/guide/getting-started" },
        ],
      },
      {
        text: "场景实践",
        items: [
          { text: "大屏设计", link: "/guide/scenarios/dashboard/" },
          { text: "表单设计", link: "/guide/scenarios/form/" },
        ],
      },
    ],
    activeMatch: "^/guide/",
  },
  {
    text: "原理",
    items: [...DesignItems],
  },
];
```

## 侧边栏配置

```javascript
const Sidebar = {
  "/guide/": [
    {
      text: "入门指南",
      items: GettingStartedGuides,
    },
    {
      text: "扩展开发",
      items: ExtensionGuides,
    },
  ],
  "/design/": DesignItems,
  "/reference/": ReferenceItems,
};
```

# 高级用法

## 使用插件

VitePress 提供了丰富的插件系统，可以帮助扩展文档站点的功能和优化。EasyEditor 项目中使用了 `vitepress-plugin-group-icons` 插件，它主要用于在 Markdown 和 Vite 配置中统一管理和显示图标。

`vitepress-plugin-group-icons` 插件有两个主要部分：一个是 Markdown 插件，用于在 Markdown 内容中使用图标，另一个是 Vite 插件，用于处理图标的相关功能。

```mts
import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

export const shared = defineConfig({
  markdown: {
    config(md) {
      // 使用 groupIconMdPlugin 插件来处理 Markdown 中的图标
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    plugins: [
      // 使用 groupIconVitePlugin 插件来处理 Vite 中的图标配置
      groupIconVitePlugin(),
    ],
  },
});
```

需要在 `.vitepress/theme/index.ts` 主题中导入 `virtual:group-icons.css` 样式文件

```mts
// .vitepress/theme/index.ts
import Theme from "vitepress/theme";
import "virtual:group-icons.css";

export default Theme;
```

示例：

<img src="/a6aec57f-5b27-4724-8a99-50ef06494c80.png" alt="">

## 自定义头部元素

你可以在配置中添加自定义的 `<head>` 元素：

```javascript
head: [
  ["link", { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }],
  [
    "link",
    {
      rel: "alternate icon",
      href: "/favicon.ico",
      type: "image/png",
      sizes: "16x16",
    },
  ],
  ["meta", { name: "author", content: "Your Name" }],
];
```

# 构建

构建文档：

```bash
pnpm docs:build
```

默认情况下，构建输出会放在 `.vitepress/dist` 目录中，可以通过 `outDir` 配置更改：

```javascript
export const shared = defineConfig({
  outDir: "./dist",
});
```

构建后的文件可以部署到任何静态网站托管服务，如 GitHub Pages、Netlify、Vercel 等。

# 实用技巧

## 大纲配置

你可以控制右侧大纲显示的标题级别。默认情况下，VitePress 只显示 `h2` 级别的标题。

```javascript
themeConfig: {
  outline: [1, 2, 3], // 只显示 h1 、 h2 和 h3 标题
}
```

示例：

<img src="/8a0ad379-2589-4f20-b7ce-0efc1966a8f1.png" alt="outline">

## 单页面配置

frontmatter 支持基于页面的配置。在每个 markdown 文件中，可以使用 frontmatter 配置来覆盖站点级别或主题级别的配置选项。此外，还有一些配置选项只能在 frontmatter 中定义。

你还可以在单个文档页面中自定义大纲显示，方法是在文档开头添加 `outline` 配置：

```markdown
---
outline: deep
---

# Runtime API Examples

...
```

此配置会让文档展示更深层次的标题结构。

更多配置项可以查看 <a href="https://vitepress.dev/zh/reference/frontmatter-config" target="_blank">frontmatter 配置 | VitePress</a>

# 总结

VitePress 是一个高效、易上手的静态文档生成工具，适合用于构建技术文档、项目文档等。通过本文的讲解，你应该已经了解了如何使用 VitePress 创建文档、配置站点和进行自定义。

更多细节请查阅 <a href="https://vitepress.dev/zh/guide/getting-started" target="_blank">VitePress 官方文档</a>
