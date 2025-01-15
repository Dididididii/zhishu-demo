import Vue from "vue";
import Router from "vue-router";
// 导入store
import store from "@/store";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import asyncRoutes from "./asyncRoutes";

const linkList = ["/login", "/404"];
// 一级路由筛选
const getFristRouterPermissions = (permissions) => {
  const fristRouterPermissions = permissions.map((item) => {
    return item.split(":")[0];
  });
  return Array.from(new Set(fristRouterPermissions));
};
// 二级路由筛选
const getSecondRouterPermissions = (permissions) => {
  const secondRouterPermissions = permissions.map((item) => {
    const arr = item.split(":");
    return `${arr[0]}:${arr[1]}`;
  });
  return Array.from(new Set(secondRouterPermissions));
};
// 路由展示筛选
const getRoutes = (firstPermissions, secondPermissions, asyncRoutes) => {
  if (firstPermissions.includes("*")) {
    return asyncRoutes;
  }
  const fristPermission = asyncRoutes.filter((item) =>
    firstPermissions.includes(item.permission)
  );
  const routes = fristPermission.map((item) => {
    return {
      ...item,
      children: item.children.filter((child) =>
        secondPermissions.includes(child.permission)
      ),
    };
  });
  return routes;
  // asyncRoutes.filter((item, index) => {
  //   console.log(firstPermissions[index]);
  //   console.log(firstPermissions.filter(first => first));

  //   // firstPermissions.find((first) => {
  //   //   // console.log(first);
  //   //   if (first === item.path.replace("/", "")) {
  //   //     arr.push(item);
  //   //   }
  //   // });
  //   item.children.forEach((child) => {
  //     const path = `${item.path.replace("/", "")}:${child.path}`;
  //     const childrenList = secondPermissions.filter(
  //       (second) => second === path
  //     );
  //     if (childrenList) {
  //       item.children = child;
  //     }
  //     // secondPermissions.find((second) => {
  //     //   // if (second === child.path.replace("/", "")) {
  //     //   //   childrenList.push(child);
  //     //   // }
  //     // });
  //     // item.children = childrenList;
  //   });
  // });

  // console.log(arr);
};

export const routes = [
  // 员工管理处理页面
  {
    path: "/sys/role/add",
    // permission: "parking:addcard",
    component: () => import("@/views/System/Role/addRole.vue"),
    meta: { title: "添加角色" },
    hidden: true,
  },
  // 企业管理处理页面
  {
    path: "/enterprise/add",
    // permission: "parking:addcard",
    component: () => import("@/views/Park/Enterprise/addEnterprise.vue"),
    meta: { title: "添加企业" },
    hidden: true,
  },
  {
    path: "/enterprise/edit",
    // permission: "parking:addcard",
    component: () => import("@/views/Park/Enterprise/addEnterprise.vue"),
    meta: { title: "编辑企业" },
    hidden: true,
  },
  {
    path: "/enterprise/see",
    // permission: "parking:addcard",
    component: () => import("@/views/Park/Enterprise/addEnterprise.vue"),
    meta: { title: "查看企业" },
    hidden: true,
  },
  // 月卡处理页面
  {
    path: "/car/addcard",
    // permission: "parking:addcard",
    component: () => import("@/views/Car/CarCard/addMonthCard.vue"),
    meta: { title: "添加月卡" },
    hidden: true,
  },
  {
    path: "/car/editcard",
    // permission: "parking:addcard",
    component: () => import("@/views/Car/CarCard/addMonthCard.vue"),

    // component: () => import("@/views/Car/CarCard/editMonthCard.vue"),
    meta: { title: "编辑月卡" },
    hidden: true,
  },
  {
    path: "/car/renewcard",
    // permission: "parking:addcard",
    component: () => import("@/views/Car/CarCard/addMonthCard.vue"),
    // component: () => import("@/views/Car/CarCard/renewMonthCard.vue"),
    meta: { title: "月卡续费" },
    hidden: true,
  },
  {
    path: "/car/checkcard",
    // permission: "parking:addcard",
    component: () => import("@/views/Car/CarCard/addMonthCard.vue"),
    meta: { title: "查看详情" },
    hidden: true,
  },
  {
    path: "/login",
    component: () => import("@/views/Login/index"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/workbench",
  },
  {
    path: "/workbench",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/Workbench/index"),
        meta: { title: "工作台", icon: "el-icon-data-board" },
      },
    ],
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    mode: "history",
    scrollBehavior: () => ({ y: 0 }),
    routes: routes,
  });

const router = createRouter();
// 添加全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 检查是否存在token
  const token = store.state.user.token;

  if (token) {
    if (to.path === "/login") {
      next("/");
    }
    next();
    const permissions = await store.dispatch("menu/getPermissions");
    const firstPermissions = getFristRouterPermissions(permissions);
    const secondPermissions = getSecondRouterPermissions(permissions);
    // console.log("firstPermissions", firstPermissions);
    // console.log("secondPermissions", secondPermissions);
    const routes = getRoutes(firstPermissions, secondPermissions, asyncRoutes);
    // console.log(routes);
    routes.forEach((item) => router.addRoute(item));
    store.commit("menu/setMenuList", routes);
  } else {
    if (linkList.includes(to.path)) {
      next();
    } else {
      next("/login");
    }
  }
});
// 重置路由方法
export function resetRouter() {
  // 得到一个全新的router实例对象
  const newRouter = createRouter();
  // 使用新的路由记录覆盖掉老的路由记录
  router.matcher = newRouter.matcher;
}

export default router;
