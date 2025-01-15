// 放置全局指令
// 导入Vue
import Vue from "vue";
// 导入store
import store from "@/store";
const adminPermission = "*:*:*";

Vue.directive("permission", {
  inserted: (el, binding) => {
    // 获取当前用户的权限
    const { value } = binding;
    const permissions = store.state.menu.permissions;
    // 如果当前用户没有此权限，则隐藏该元素,且判断是不是管理员
    if (
      !permissions.includes(value) &&
      !permissions.includes(adminPermission)
    ) {
      el.remove();
    }
  },
});
