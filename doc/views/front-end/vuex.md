# 什么是 Vuex？

Vuex 是专为`Vue.js`应用程序设计的状态管理库，采用集中式存储管理应用的所有组件状态，其核心是通过单一状态树（Single Source of Truth）解决组件间数据共享和状态管理的复杂性问题，适用于中大型单页面应用（SPA）。

## 主要核心

- State：存储应用所用状态的单一对象，作为唯一数据源。
- Mutations：同步修改`State`的唯一方式，确保状态变更可追踪。
- Actions：处理一步操作或者负载逻辑，通过提交`Mutations`间接修改`State`。
- Getters：从`State`派生的计算属性，避免组件中重复计算。

## 基础配置以及使用

```javascript
// store/index.js
import Vuex from "vuex";
export default {
  state: {
    user: {},
  },
  mutations: {
    SET: (state, obj) => {
      state[obj.key] = obj.value;
    },
  },
  acions: {
    setUser: ({ commit }, value) => {
      if (value) {
        commit("SET", { key: "user", value });
      } else {
        axios.get("/user").then((res) => {
          commit("SET", { key: "user", value: res });
        });
      }
    },
  },
  getters: {
    getUser: (state) => {
      return state.user;
    },
  },
};

// index.vue
import { useStore } from "vuex";
const store = useStore();

// 使用mutations直接设置
store.commit("SET", { key: "user", value: { name: "张三" } });

// 使用actions间接设置
store.dispatch("setUser", { name: "张三" });

// 获取user
console.log(store.state.user);

// 使用getters获取state
const name = store.getters.getUser;
console.log(name);
```

## 进阶版 使用 modules 分模块

- 目录结构

![alt text](image.png)

- `modules`下的文件结构

```javascript
// user.js
export default {
  namespaced: true,
  state: {
    user: {},
    // ……
  },
  mutations: {
    // obj: {key: 'user', value: {name: '张三'}}
    SET: (state, obj) => {
      state[obj.key] = obj.value;
    },
    // ……
  },
  actions: {
    getUser: ({ commit, state }) => {
      return new Promise(async (resolve, reject) => {
        try {
          const res = await axios.get("/user");
          commit("SET", { key: "user", value: res });
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  getters: {
    getName: (state) => {
      return state.user.name;
    },
  },
};
```

- `getters.js`文件结构

```javascript
export default {
  model: (state) => state.model,
  theme: (state) => state.theme,
  user: (state) => state.user,
};
```

- `index.js`文件结构

```javascript
import Vuex from "vuex";
import getters from "./getters";
import user from "./modules/user";
import theme from "./modules/theme";
import model from "./modules/model";

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    theme,
    model,
  },
  getters,
});
```

- 在 vue 组合式 里使用

```javascript
import { useStore } from "vuex";

const store = useStore();

// 使用时需要注意的是，因为使用了modules区分了模块，所以需要加上模块名
// 使用mutations直接修改
store.commit("user/SET", { key: "user", value: { name: "张三" } });

// 使用actions间接修改
store.dispatch("user/getUser");

// 获取state
console.log(store.state.user.user);

// 使用geeters获取state
const name = store.getters.user.getName;

console.log(name);
```

- 在 vue 选项式 里使用

```javascript
// 方式一：
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("user", ["user"]),
  },
  methods: {
    ...mapActions("user", ["getUser"]),
    async getUser() {
      const user = await this.getUser();
      console.log(user);
    },
    getName() {
      return this.user.name;
    },
  },
};

// 方式二：
import { useStore } from "vuex";
const store = useStore();
export default {
  methods: {
    async getUser() {
      const user = await store.dispatch("user/getUser");
      console.log(user);
    },
    getName() {
      return store.getters.user.getName;
    },
  },
};
```
