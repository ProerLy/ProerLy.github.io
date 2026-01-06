import { defineConfig } from "vitepress";
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from "vitepress-plugin-group-icons";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/proerly.github.io/",
  title: "熙熙的个人博客",
  description: "熙熙的个人博客",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "前端",
        items: [
          { text: "Js笔记", link: "/views/front-end/js" },
          { text: "vuex", link: "/views/front-end/vuex" },
          {
            text: "问题记录",
            items: [
              { text: "html", link: "/views/front-end/html-example" },
              { text: "css", link: "/views/front-end/css-example" },
              { text: "js", link: "/views/front-end/js-example" },
              { text: "http", link: "/views/front-end/http-example" },
              { text: "vue2", link: "/views/front-end/vue2-example" },
              { text: "vue3", link: "/views/front-end/vue3-example" },
              { text: "vite", link: "/views/front-end/vite-example" },
            ],
          },
        ],
      },
      {
        text: "vitePress文档",
        link: "/views/vite-press",
      },
      {
        text: "git",
        link: "/views/git",
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
