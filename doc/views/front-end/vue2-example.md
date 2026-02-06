# Vue2 项目打包文件放在服务器后，浏览器存在缓存问题的解决方案

- 使用版本控制

为你的静态资源文件名添加版本号或哈希值。这样，每次文件内容更新时，文件名也会改变，从而迫使浏览器加载新的文件。例如，如果你的文件名是 `app.js`，你可以将其改为 `app.12345.js`，其中 `12345` 是文件内容的哈希值。

- Vue CLI 项目配置示例：

在 Vue CLI 创建的项目中，你可以通过设置 `publicPath` 或者使用 `filename: utils.assetsPath('js/[name].[chunkhash:8].js')` 在 `webpack` 配置中自动添加哈希值。

‌ 修改 `vue.config.js`：

```javascript
const path = require("path");
// 判断是否为“需要哈希 + 压缩”的环境
// 即：不是 development（包括 production / test / staging 等）
const isBuilding =
  process.env.NODE_ENV === "production" ||
  (process.argv.includes("build") && !process.argv.includes("serve"));

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: ["element-ui", "ele-admin", "vue-i18n"],
  filenameHashing: isBuilding, // 注意：这里逻辑要小心
  chainWebpack: (config) => {
    // 删除 prefetch 预加载
    config.plugins.delete("prefetch");
    if (isBuilding) {
      // 🔧 1. 启用 contenthash 文件名（缓存 busting）
      // 入口文件使用 contenthash
      config.output.filename("js/[name].[contenthash:8].js");

      // 异步 chunk（代码分割）也使用 contenthash
      config.output.chunkFilename("js/[name].[contenthash:8].js");

      // ✅✅ 添加 runtime chunk
      config.optimization.runtimeChunk({
        name: "runtime",
      });

      // 🔧 2. 图片等静态资源也加 hash
      config.module
        .rule("images")
        .use("url-loader")
        .tap((options) => ({
          ...options,
          name: "img/[name].[hash:8].[ext]",
        }));

      // 🔧 3. Gzip 压缩 >10KB 的文件
      const CompressionWebpackPlugin = require("compression-webpack-plugin");
      config.plugin("compressionPlugin").use(
        new CompressionWebpackPlugin({
          test: /\.(js|css|html|txt)$/i, // 匹配的文件类型
          threshold: 10240, // 超过 10KB 才压缩
          minRatio: 0.8, // 压缩率低于 0.8 才输出（可选）
          deleteOriginalAssets: false, // 不删除原始文件（保留 .js 和 .js.gz）
        }),
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

# Vue2 项目打包时将 console.log()和 debugger 去除的方法

在 `vue.config.js` 中使用`terser-webpack-plugin` 的配置项：

```javascript
const path = require("path");
// 判断是否为“需要哈希 + 压缩”的环境
// 即：不是 development（包括 production / test / staging 等）
const isBuilding =
  process.env.NODE_ENV === "production" ||
  (process.argv.includes("build") && !process.argv.includes("serve"));

module.exports = {
  chainWebpack: (config) => {
    if (isBuilding) {
      const TerserPlugin = require("terser-webpack-plugin");
      // 安全地扩展 minimizer，而不是覆盖整个 optimization
      if (!config.optimization) config.optimization = {};
      const existingMinifiers = Array.isArray(config.optimization.minimizer)
        ? config.optimization.minimizer
        : [];
      config.optimization.minimizer = [
        ...existingMinifiers,
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          },
          parallel: true,
          sourceMap: false,
        }),
      ];
    }
  },
};
```

# Vue2 webpack 配置 解决内存不足问题的方法

```javascript
const path = require("path");
// 判断是否为“需要哈希 + 压缩”的环境
// 即：不是 development（包括 production / test / staging 等）
const isBuilding =
  process.env.NODE_ENV === "production" ||
  (process.argv.includes("build") && !process.argv.includes("serve"));

module.exports = {
  chainWebpack: (config) => {
    if (!isBuilding) {
      // 启用文件系统缓存（大幅减少重复构建内存/CPU）
      config.cache({
        type: "filesystem", // 缓存类型
        cacheDirectory: path.resolve(
          __dirname,
          "./node_modules/.cache/webpack",
        ), // 缓存目录
      });
    }
  },
  // 或者
  configureWebpack: {
    cache: {
      type: "filesystem", // 缓存类型
      cacheDirectory: path.resolve(__dirname, "./node_modules/.cache/webpack"), // 缓存目录
    },
  },
};
```

```javascript
// 修改后的 scripts（推荐 4GB 内存）
"scripts": {
    "dev": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js serve",
    "test": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js serve --open --mode test",
    "build": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build",
    "build:dev": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode development",
    "build:test": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode test",
    "build:prod": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode production",
    "build:preview": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build --mode preview",
    "build:report": "node --max-old-space-size=4096 node_modules/@vue/cli-service/bin/vue-cli-service.js build --report",
    "lint": "vue-cli-service lint"
  },
```
