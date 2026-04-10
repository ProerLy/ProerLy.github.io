## 一、Axios 是什么？

Axios 是一个基于 Promise 的 HTTP 客户端，可用于：

🌐 浏览器：创建 XMLHttpRequests

🖥️ Node.js：创建 HTTP 请求

✅ 自动转换 JSON 数据

🔒 支持 CSRF 防护（XSRF）

🔄 请求/响应拦截器

❌ 请求取消（AbortController / CancelToken）

📦 并发请求控制

官网中文文档：<a href="https://www.axios-http.cn" target="_blank">https://www.axios-http.cn</a>

## 二、安装与引入

1. 安装

```bash

# npm
npm install axios

# yarn
yarn add axios

# CDN（浏览器直接使用）
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

2. 引入方式

```javascript
// ES6 模块
import axios from "axios";

// CommonJS
const axios = require("axios");

// 浏览器全局变量（CDN）
const axios = window.axios;
```

## 三、基本用法

1. 通用请求方法

```javascript
// 最基础写法
axios({
  method: "post",
  url: "/user",
  data: {
    firstName: "Fred",
    lastName: "Flintstone",
  },
})
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
```

2.  快捷方法（推荐）

```javascript
// GET
axios.get("/user?id=123").then((res) => console.log(res.data));

// 或带 params
axios.get("/user", {
  params: { id: 123 },
});

// POST
axios.post("/user", {
  name: "John",
  age: 30,
});

// 其他方法
axios.put("/user/1", { name: "Jane" });
axios.delete("/user/1");
axios.head("/user");
axios.options("/user");
```

3. 使用 async/await（推荐）

```javascript
async function fetchUser() {
  try {
    const res = await axios.get("/user/1");
    console.log(res.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("请求被取消");
    } else {
      console.error("请求失败:", error);
    }
  }
}
```

## 四、Axios 配置详解

**完整配置对象**

```javascript
{
// `url` 是服务器地址
url: '/user',

// `method` 请求方法
method: 'get', // 默认

// `baseURL` 将自动加在 `url` 前面
baseURL: 'https://api.example.com',

// `transformRequest` 允许在请求数据发送到服务器前对其进行修改
transformRequest: [function (data, headers) {
// 对 data 进行任意转换
return data;
}],

// `headers` 自定义请求头
headers: {'X-Requested-With': 'XMLHttpRequest'},

// `params` 是与请求一起发送的 URL 参数
params: {
ID: 12345
},

// `data` 是作为请求体发送的数据（仅适用于 PUT、POST、PATCH）
data: {
firstName: 'Fred'
},

// `timeout` 指定请求超时的毫秒数（0 表示无超时）
timeout: 1000,

// `withCredentials` 跨域请求是否需要凭证
withCredentials: false, // 默认

// `adapter` 允许自定义处理请求
adapter: function (config) { /_ ... _/ },

// `auth` 表示应该使用 HTTP 基础验证
auth: {
username: 'janedoe',
password: 's00pers3cret'
},

// `responseType` 表示服务器响应的数据类型
responseType: 'json', // 默认 'json'

// `cancelToken` 指定用于取消请求的 cancel token
cancelToken: new CancelToken(function (cancel) {})
}
```

## 五、请求与响应结构

**响应对象结构**

```javascript
axios.get("/user/12345").then(function (response) {
  console.log(response.data); // 服务器返回的数据
  console.log(response.status); // HTTP 状态码
  console.log(response.statusText); // 状态信息
  console.log(response.headers); // 响应头
  console.log(response.config); // 请求配置
});
```

**错误处理**

```javascript
axios.get("/user/12345").catch(function (error) {
  if (error.response) {
    // 服务器返回了错误状态码（4xx, 5xx）
    console.log(error.response.data);
    console.log(error.response.status);
  } else if (error.request) {
    // 请求已发出但未收到响应（如网络中断）
    console.log(error.request);
  } else {
    // 其他错误
    console.log("Error", error.message);
  }
  console.log(error.config);
});
```

## 六、高级功能

1. 请求取消（推荐使用 AbortController）

⚠️ 注意：CancelToken 已废弃，推荐使用 AbortController

使用 AbortController（现代浏览器 / Node.js 15+）

```javascript
const controller = new AbortController();

axios
  .get("/user", {
    signal: controller.signal,
  })
  .then((res) => console.log(res))
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log("请求被取消:", err.message);
    }
  });

// 取消请求
controller.abort("用户取消操作");
```

**兼容旧版（使用 CancelToken）**

```javascript
const source = axios.CancelToken.source();

axios.get("/user", {
  cancelToken: source.token,
});

// 取消
source.cancel("Operation canceled by the user.");
```

2. 拦截器（Interceptors）

**请求拦截器**

```javascript
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    config.headers["Authorization"] = "Bearer " + getToken();
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);
```

**响应拦截器**

```javascript
axios.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 对响应错误做点什么
    if (error.response?.status === 401) {
      // 处理未授权
      redirectToLogin();
    }
    return Promise.reject(error);
  },
);
```

**移除拦截器**

```javascript

const myInterceptor = axios.interceptors.request.use(...);
axios.interceptors.request.eject(myInterceptor);
```

3. 创建实例（推荐用于项目封装）

```javascript
// 创建实例
const instance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 10000,
  headers: { "X-Custom-Header": "foobar" },
});

// 使用实例
instance.get("/user").then((res) => console.log(res));
```

4. 并发请求

```javascript
function getUserAccount() {
  return axios.get("/user/12345");
}

function getUserPermissions() {
  return axios.get("/user/12345/permissions");
}

// 并发执行
axios.all([getUserAccount(), getUserPermissions()]).then(
  axios.spread((acct, perms) => {
    // 两个请求都完成
    console.log(acct.data, perms.data);
  }),
);

// 或使用 Promise.all（更现代）
Promise.all([getUserAccount(), getUserPermissions()]).then(([acct, perms]) => {
  console.log(acct.data, perms.data);
});
```

## 七、Vue 项目中的最佳实践（以 Vue 2 为例）

1. 全局配置（main.js）

```javascript
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

// 全局挂载
Vue.use(VueAxios, axios);

// 设置默认值
axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
axios.defaults.timeout = 10000;
```

2. 封装 API 模块（api/user.js）

```javascript
import axios from "axios";

export const userApi = {
  list(params) {
    return axios.get("/users", { params });
  },
  create(data) {
    return axios.post("/users", data);
  },
  update(id, data) {
    return axios.put(`/users/${id}`, data);
  },
  delete(id) {
    return axios.delete(`/users/${id}`);
  },
};
```

3. 组件中使用

```javascript
import { userApi } from "@/api/user";

export default {
  async created() {
    try {
      const res = await userApi.list({ page: 1 });
      this.users = res.data;
    } catch (error) {
      this.$message.error("获取用户列表失败");
    }
  },
};
```

4. 自动取消重复请求（防抖）

```javascript
// request.js
const pending = new Map();

const generateKey = (config) => {
  return `${config.method}_${config.url}_${JSON.stringify(config.params)}_${JSON.stringify(config.data)}`;
};

const addPending = (config) => {
  const key = generateKey(config);
  if (pending.has(key)) {
    pending.get(key)("重复请求被取消");
  }
  const cancelToken = new axios.CancelToken((cancel) => {
    pending.set(key, cancel);
  });
  config.cancelToken = cancelToken;
};

const removePending = (config) => {
  const key = generateKey(config);
  if (pending.has(key)) {
    pending.delete(key);
  }
};

axios.interceptors.request.use((config) => {
  addPending(config);
  return config;
});

axios.interceptors.response.use(
  (response) => {
    removePending(response.config);
    return response;
  },
  (error) => {
    removePending(error.config);
    return Promise.reject(error);
  },
);
```

## 八、常见问题与解决方案

Q1: 如何处理 Token 过期？

```javascript
// 响应拦截器中
if (error.response?.status === 401) {
  store.dispatch("logout");
  router.push("/login");
}
```

Q2: 如何上传文件？

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);

axios.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
```

Q3: 如何设置全局 loading？

```javascript
let loadingCount = 0;

axios.interceptors.request.use((config) => {
  if (loadingCount === 0) showLoading();
  loadingCount++;
  return config;
});

axios.interceptors.response.use(
  (response) => {
    loadingCount--;
    if (loadingCount === 0) hideLoading();
    return response;
  },
  (error) => {
    loadingCount--;
    if (loadingCount === 0) hideLoading();
    return Promise.reject(error);
  },
);
```

## 九、Axios vs Fetch

| 特性            | Axios                 | Fetch                    |
| --------------- | --------------------- | ------------------------ |
| 浏览器支持      | 所有现代浏览器 + IE11 | 不支持 IE                |
| 自动 JSON 转换  | ✅                    | ❌ 需手动 .json()        |
| 请求/响应拦截   | ✅                    | ❌                       |
| 请求取消        | ✅                    | ✅（需 AbortController） |
| 超时设置        | ✅                    | ❌（需手动实现）         |
| 错误处理        | HTTP 错误也 reject    | 仅网络错误 reject        |
| TypeScript 支持 | ✅                    | 内置 ✅                  |

建议：除非你追求极致轻量，否则优先选择 Axios。

## 十、总结

✅ 始终使用拦截器统一处理 Token、错误、Loading

✅ 使用 AbortController 取代 CancelToken

✅ 创建 Axios 实例进行模块化管理

✅ 封装 API 层，避免在组件中直接写 URL

✅ 合理使用并发请求提升性能

📚 官方文档永远是最好的参考：<a href="https://www.axios-http.cn" target="_blank">https://www.axios-http.cn</a>
