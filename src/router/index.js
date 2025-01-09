import Vue from "vue";
import Router from "vue-router";
// 导入store
import store from "@/store";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

const linkList = ["/login", "/404"];

export const routes = [
  // 企业管理处理页面
  {
    path: "/enterprise/add",
    // permission: "parking:addcard",
    component: () => import("@/views/Park/Enterprise/addEnterprise.vue"),
    meta: { title: "添加企业" },
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
    path: "/park",
    component: Layout,
    permission: "park",
    meta: { title: "园区管理", icon: "el-icon-office-building" },
    children: [
      {
        path: "building",
        permission: "park:building",
        meta: { title: "楼宇管理" },
        component: () => import("@/views/Park/Building/index"),
      },
      {
        path: "enterprise",
        permission: "park:enterprise",
        meta: { title: "企业管理" },
        component: () => import("@/views/Park/Enterprise/index"),
      },
    ],
  },

  {
    path: "/parking",
    component: Layout,
    permission: "parking",
    meta: { title: "行车管理", icon: "el-icon-guide" },
    children: [
      {
        path: "area",
        permission: "parking:area",
        component: () => import("@/views/Car/CarArea"),
        meta: { title: "区域管理" },
      },
      {
        path: "card",
        permission: "parking:card",
        component: () => import("@/views/Car/CarCard"),
        meta: { title: "月卡管理" },
      },
      {
        path: "pay",
        permission: "parking:payment",
        component: () => import("@/views/Car/CarPay"),
        meta: { title: "停车缴费管理" },
      },
      {
        path: "rule",
        permission: "parking:rule",
        component: () => import("@/views/Car/CarRule"),
        meta: { title: "计费规则管理" },
      },
    ],
  },
  {
    path: "/pole",
    component: Layout,
    permission: "pole",
    meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
    children: [
      {
        path: "info",
        permission: "pole:info",
        component: () => import("@/views/Rod/RodManage"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "waring",
        permission: "pole:warning",
        component: () => import("@/views/Rod/RodWarn"),
        meta: { title: "告警记录" },
      },
    ],
  },
  {
    path: "/sys",
    component: Layout,
    permission: "sys",
    meta: { title: "系统管理", icon: "el-icon-setting" },
    children: [
      {
        path: "role",
        permission: "sys:role",
        component: () => import("@/views/System/Role/index"),
        meta: { title: "角色管理" },
      },
      {
        path: "user",
        permission: "sys:user",
        component: () => import("@/views/System/Employee/index"),
        meta: { title: "员工管理" },
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
router.beforeEach((to, from, next) => {
  // 检查是否存在token
  const token = store.state.user.token;

  if (token) {
    if (to.path === "/login") {
      next("/");
    }
    next();
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
