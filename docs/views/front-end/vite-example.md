# vite的常用配置

## 完整代码

```javascript
import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from "path";
import gzipPlugin from "rollup-plugin-gzip"; // ← 正确导入

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // 获取环境变量
  return {
    build: {
      minify: "esbuild",
      target: "es2015",
      outDir: `dist/${mode}`, // 输出目录
      esbuild: {
        drop: ["console", "debugger"], // 删除 console.log
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/var.scss";`, // 引入全局样式
        },
      },
      postcss: "./postcss.config.cjs", // 明确指向 .cjs 文件
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // 配置别名
      },
      // 👇 关键：添加 .vue 到自动解析的扩展名列表，在引入时可忽略后缀
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    // 👇 添加插件
    plugins: [
      vue(),
      gzipPlugin({
        filter: (fileName, source) => {
          if (!source) return false; // 空文件不压缩

          const size =
            typeof source === "string"
              ? Buffer.byteLength(source)
              : source.length || source.byteLength || 0;

          return size > 10 * 1024;
        },
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()], // 默认导入 element-plus
        imports: ["vue", "vue-router", "vuex"], // 默认导入 vue
      }),
      Components({
        resolvers: [ElementPlusResolver()], // 默认导入 element-plus
      }),
    ],
    server: {
      proxy: {
        // 配置代理
        "/api": {
          // 拦截以 /api 开头的请求
          target: env.VITE_API_BASE, // 接口域名
          changeOrigin: true, //是否跨域
        },
      },
    },
  };
});
```

## 配置说明

### ✅ 1. 导入依赖模块

```javascript
import { defineConfig, loadEnv } from "vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
import path from "path";
import gzipPlugin from "rollup-plugin-gzip";
```

- **作用：引入构建项目所需的各类插件和工具。**
  - defineConfig：Vite 提供的类型安全配置函数。
  - loadEnv：用于加载 .env 文件中的环境变量。
  - AutoImport / Components：自动导入 Vue API 和组件（避免手动 import）。
  - ElementPlusResolver：配合上述插件，自动按需引入 Element Plus 组件。
  - vue：Vite 官方 Vue 插件，支持 .vue 单文件组件。
  - path：Node.js 路径模块，用于处理文件路径。
  - gzipPlugin：在构建时自动生成 .gz 压缩文件，提升传输效率。

### ✅ 2. 动态加载环境变量

```javascript
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
```

- **作用：根据当前运行模式（如 development、production）加载对应的 .env.[mode] 文件。**
  - 例如：vite build --mode staging 会加载 .env.staging。
  - 第三个参数 "" 表示加载所有前缀的变量（默认只加载 VITE\* 开头的，这里取消限制）。

⚠️ 注意：出于安全考虑，通常建议保留 VITE\* 前缀，避免泄露敏感变量。此处全量加载需谨慎。

### ✅ 3. 构建优化配置（build）

```javascript
build: {
  minify: "esbuild",
  target: "es2015",
  esbuild: {
    drop: ["console", "debugger"],
  },
},
```

- **作用：优化生产构建输出。**
  - minify: "esbuild"：使用 esbuild 进行极速代码压缩（比 terser 快很多）。
  - target: "es2015"：生成兼容 ES2015（ES6）语法的代码，兼顾现代浏览器性能与兼容性。
  - drop: ["console", "debugger"]：自动移除所有 console.log 和 debugger 语句，防止泄露调试信息。

### ✅ 4. CSS 预处理与 PostCSS 配置

```javascript
css: {
  preprocessorOptions: {
    scss: {
      additionalData: `@import "@/styles/var.scss";`,
    },
  },
  postcss: "./postcss.config.cjs",
},
```

- **作用：**
  - additionalData：在每个 SCSS 文件顶部自动注入全局样式（如变量、mixin），无需手动 @import。
  - postcss: "./postcss.config.cjs"：显式指定 PostCSS 配置文件（.cjs 是 CommonJS 格式，兼容 Node.js）。

### ✅ 5. 路径别名与扩展名解析

```javascript
resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
  },
  extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
},
```

- **作用：**
  - alias["@"]：将 @/xxx 映射到 src/xxx，简化导入路径（如 @/components/Button.vue）。
  - extensions：定义自动解析的文件扩展名列表，允许导入 .vue 文件时不写后缀（如 import App from './App'）。

### ✅ 6. 插件注册（核心功能增强）

```javascript
plugins: [
  vue(),
  gzipPlugin({ /* ... */ }),
  AutoImport({ /* ... */ }),
  Components({ /* ... */ }),
],
```

- **各插件作用：**
  - vue()：启用 Vue 3 单文件组件（SFC）支持。
  - gzipPlugin：
    - 对大于 10KB 的构建产物生成 .gz 压缩版本。
    - 需要服务器（如 Nginx）配置 gzip_static on; 才能生效。
  - AutoImport：
    - 自动导入 vue, vue-router, vuex 中的常用 API（如 ref, computed, useRouter）。
    - 结合 ElementPlusResolver，自动导入 Element Plus 组件所需 API。
  - Components：- 自动注册 Element Plus 组件（如 `<el-button>`），无需手动 import 和 component: {} 注册。

  💡 这两个 unplugin 插件极大减少样板代码，提升开发体验。

### ✅ 7. 开发服务器代理（解决跨域）

```javascript
server: {
  proxy: {
    "/api": {
      target: env.VITE_API_BASE,
      changeOrigin: true,
    },
  },
},
```

- **作用：在开发阶段（vite dev）代理 API 请求，绕过浏览器 CORS 限制。**
  - 所有以 /api 开头的请求会被转发到 VITE_API_BASE（如 `http://localhost:3000`）。
  - changeOrigin: true：确保 Host 头正确，适用于大多数后端服务。

### ✅ 8. 构建输出目录（按模式区分）

```javascript
build: {
  outDir: `dist/${mode}`,
}
```

- **作用：将不同环境的构建产物分开存放。**
  - vite build --mode development → 输出到 dist/development
  - vite build --mode production → 输出到 dist/production
    好处：方便多环境部署、对比或缓存管理。

# 在 `vite` + `vue` 中 结合 `postcss` + `postcss-pxtorem` + `autoprefixer` 配置 `px` 转 `rem`

1. 安装 `postcss` `postcss-pxtorem` `autoprefixer`：

```bush
npm i postcss postcss-pxtorem autoprefixer -D
```

2. 在 `vite.config.js` 文件平级目录下创建 `postcss.config.cjs` 文件，添加以下代码：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {}, // 可选，但推荐用于添加浏览器前缀
    "postcss-pxtorem": {
      rootValue: 16, // 设计稿基准字体大小，通常为 16px
      unitPrecision: 5, // 保留小数点后几位
      propList: ["*"], // 需要转换的属性，* 表示所有
      selectorBlackList: [], // 忽略的选择器
      replace: true, // 是否直接替换而不是添加新属性
      mediaQuery: false, // 是否转换媒体查询中的 px
      minPixelValue: 1, // 小于该值的 px 不会被转换
    },
  },
};
```

3. 在 `vite.config.js` css 中添加以下代码

```javascript
export default defineConfig(() => {
  return {
    css: {
      postcss: "./postcss.config.cjs", // 明确指向 .cjs 文件
    },
  };
});
```

4. 创建 `setRem.js` 文件，添加以下代码：

```javascript
/**
 * 动态设置根元素的字体大小
 * @param {number} designWidth - 设计稿的宽度
 */
function setRem(designWidth) {
  const docEl = document.documentElement;
  const resizeEvt =
    "orientationchange" in window ? "orientationchange" : "resize";

  const recalc = () => {
    const clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    // 根据设计稿宽度计算根元素字体大小
    docEl.style.fontSize = 16 * (clientWidth / designWidth) + "px";
  };

  if (!document.addEventListener) return;
  window.addEventListener(resizeEvt, recalc, false);
  document.addEventListener("DOMContentLoaded", recalc, false);
}
setRem(1920);

export default setRem;
```

5. 在 `main.js` 中引入 `setRem.js` 文件，并调用 `setRem` 函数：

```javascript
import "./setRem.js";
```

6. 效果图：

- 在不同尺寸的设备上查看效果

![alt text](image-2.png)

![alt text](image-3.png)
