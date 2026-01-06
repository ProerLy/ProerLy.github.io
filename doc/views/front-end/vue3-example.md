# 动态路由注入问题，以及注意事项

- 当我们使用 for 循环注入时需要使用 `import.meta.glob("../views/**/*.vue")`

```javascript
const routes = [
  {
    path: "home",
    component: () => import("@/views/home.vue"),
    meta: { title: "首页" },
  },
  {
    path: "about",
    component: () => import("@/views/about.vue"),
    meta: { title: "关于" },
  },
  ······
]
// ✅ 使用 import.meta.glob 预加载所有 views
const viewsModules = import.meta.glob("../views/**/*.vue");

// ✅ 构建动态路由
const dynamicRoutes = buildRoutes(menus, viewsModules);

// ✅ 添加子路由
// dynamicRoutes.forEach((route) => {
//   router.addRoute(route);
// });
router.addRoute({
  path: "/",
  component: Layout,
  redirect: home,
  children: dynamicRoutes,
  meta: { requiresAuth: true },
});
----------------
// 构建动态路由
function buildRoutes(menus, viewsModules) {
  return menus.map((menu) => {
    // 👇 安全处理 component
    let comp = menu.component;
    // 如果 component 不存在（null/undefined/空字符串），跳过或设为 404
    if (!comp || typeof comp !== "string") {
      // 可选：如果是目录（无 component），可以不指定 component（但 Vue Router 要求有）
      // 通常目录菜单应设置 redirect 或 children，但 component 可设为 Layout 占位
      // 这里我们用一个空布局或 404
      return {
        path: menu.path,
        meta: { title: menu.title },
        redirect: menu.redirect,
        ...(menu.children
          ? { children: buildRoutes(menu.children, viewsModules) }
          : {}),
      };
    }

    // 标准化路径
    if (comp.startsWith("/")) comp = comp.slice(1);
    if (comp.endsWith(".vue")) comp = comp.slice(0, -4);

    const fullPath = `../views/${comp}.vue`;
    const fullPath2 = `../views/${comp}/index.vue`;
    const component = viewsModules[fullPath] || viewsModules[fullPath2];

    const route = {
      path: menu.path,
      component,
      redirect: menu.redirect,
      meta: { title: menu.title },
    };

    if (menu.children?.length) {
      route.children = buildRoutes(menu.children, viewsModules);
    }

    return route;
  });
}
```

- 如果需要注入到制定的路由下面需要在父路由添加 `name`，并且在添加路由时需要表明父 `name`

```javascript
const routes = [
  {
    path: "home",
    name: 'Home',
    component: () => import("@/views/home.vue"),
    meta: { title: "首页" },
  },
  {
    path: "about",
    component: () => import("@/views/about.vue"),
    meta: { title: "关于" },
  },
  ······
]

dynamicRoutes.forEach((route) => {
  router.addRoute('Home', route);
});
```
