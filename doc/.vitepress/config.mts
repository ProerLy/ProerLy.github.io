import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "熙熙的个人博客",
  description: "熙熙的个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "前端",
        items: [
          { text: "Js笔记", link: "/views/front-end/js" },
          {
            text: "实例记录",
            link: "/views/front-end/example",
          },
        ],
      },
      {
        text: "vitePress文档",
        link: "/views/vite-press",
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
    outline: [1, 2, 3], // 只显示 h1 、 h2 和 h3 标题
  },
  markdown: {
    lineNumbers: true, // 启用所有代码块的行号
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
  locales: {
    root: {
      label: "中文",
      lang: "Zh-CN",
    },
    fr: {
      label: "English",
      lang: "en", // 设置 <html lang="en">
      link: "/en", // 显示在语言切换菜单中的链接（默认为 /en/）

      // 可以添加 en 特定的 themeConfig、sidebar、nav 等配置
    },
  },
  // 构建后的静态文件输出目录
  output: "./dist",
});
