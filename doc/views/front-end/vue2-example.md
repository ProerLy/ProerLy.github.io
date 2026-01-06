# Vue2 项目打包文件放在服务器后，浏览器存在缓存问题的解决方案

- 使用版本控制

为你的静态资源文件名添加版本号或哈希值。这样，每次文件内容更新时，文件名也会改变，从而迫使浏览器加载新的文件。例如，如果你的文件名是 `app.js`，你可以将其改为 `app.12345.js`，其中 `12345` 是文件内容的哈希值。

- Vue CLI 项目配置示例：

在 Vue CLI 创建的项目中，你可以通过设置 `publicPath` 或者使用 `filename: utils.assetsPath('js/[name].[chunkhash:8].js')` 在 `webpack` 配置中自动添加哈希值。

‌ 修改 `vue.config.js`：

```javascript
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const path = require("path");
// 判断是否为“需要哈希 + 压缩”的环境
// 即：不是 development（包括 production / test / staging 等）
const isBuildMode = process.env.NODE_ENV !== "development";

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: ["element-ui", "ele-admin", "vue-i18n"],
  chainWebpack: (config) => {
    // 删除 prefetch 预加载
    config.plugins.delete("prefetch");
    if (isBuildMode) {
      // 🔧 1. 启用 contenthash 文件名（缓存 busting）
      config.output
        .filename("js/[name].[contenthash:8].js")
        .chunkFilename("js/[name].[contenthash:8].chunk.js");

      // 🔧 2. 图片等静态资源也加 hash
      config.module
        .rule("images")
        .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
        .use("url-loader")
        .loader("url-loader")
        .tap((options) => ({
          ...options,
          name: "img/[name].[hash:8].[ext]",
        }));

      // 🔧 3. Gzip 压缩 >10KB 的文件
      config.plugin("compressionPlugin").use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html|txt)$/i, // 匹配的文件类型
          threshold: 10240, // 超过 10KB 才压缩
          minRatio: 0.8, // 压缩率低于 0.8 才输出（可选）
          deleteOriginalAssets: false, // 不删除原始文件（保留 .js 和 .js.gz）
        })
      );
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src/"),
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          outputStyle: "expanded",
        },
        additionalData: `@import "@/styles/index.scss";`,
      },
    },
  },
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
```
