## Vue2 项目打包文件放在服务器后，浏览器存在缓存问题的解决方案

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

## 解决在切换路由或加载页面时，出现加载js404的问题

这个问题在 Vue 2 + Vue CLI 项目中很常见，主要原因是 前端路由与后端服务器配置不匹配 导致的。让我详细解释一下：

### 🔍 问题根本原因

1. Vue Router 的 History 模式问题
   当你使用 vue-router 的 history 模式时：

```javascript
// router/index.js
const router = new VueRouter({
  mode: 'history', // 👈 这里是关键
  routes: [...]
})
```

正常情况下：访问 https://domain.com/ → 返回 index.html

切换到其他页面：URL 变成 https://domain.com/product/detail

但这个 URL 实际上并不存在于服务器上

2. 静态资源缓存过期

页面停留时间较长后，浏览器缓存的 JS/CSS 文件可能过期
切换页面时，Vue 尝试加载新的 chunk 文件（如 js/chunk-xxxxx.js）
如果这些文件名包含 hash，而服务器上文件已被更新或清理，就会 404

3. 服务器未正确配置 fallback

当用户直接访问 https://domain.com/product/detail 或刷新页面时：

服务器会尝试找 /product/detail 这个物理路径
找不到就返回 404

正确做法应该是返回 index.html，让前端路由处理

### ✅ 解决方案

方案一：配置服务器 fallback（推荐）

Nginx 配置：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

Apache 配置（.htaccess）：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Express.js 配置：

```javascript
const express = require("express");
const app = express();

// 静态文件服务
app.use(express.static(path.join(__dirname, "dist")));

// 所有其他请求都返回 index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
```

### 方案二：改用 hash 模式（简单但 URL 不美观）

```javascript
const router = new VueRouter({
  mode: 'hash', // URL 会变成 #/product/detail
  routes: [...]
})
```

### 方案三：优化构建配置（解决 chunk 404）

在 vue.config.js 中配置：

```javascript
module.exports = {
  // 确保所有资源都相对于根路径
  publicPath: "/",

  // 或者如果你部署在子目录
  // publicPath: '/your-subdirectory/',

  configureWebpack: {
    output: {
      // 确保 chunk 文件路径正确
      publicPath: "/",
    },
  },
};
```

### 方案四：添加错误处理和重试机制

```javascript
// router/index.js
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);

  if (isChunkLoadFailed) {
    // 重新加载页面
    window.location.reload();
    // 或者显示友好的错误提示
    // this.$message.error('页面资源加载失败，请刷新页面');
  }
});
```

## Vue2 项目打包时将 console.log()和 debugger 去除的方法

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
