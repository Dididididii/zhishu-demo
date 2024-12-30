// 导入保存/获取 tokenCooke方法
import { getToken, setToken } from "@/utils/auth";
// 导入登录接口
import { loginAPI } from "@/api/user";
// 导入保存/删除 Remember方法
import { setRemember, delRemember } from "@/utils/auth";
// 导入消息提示组件
import { Message } from "element-ui";
// 导入router
import router from "@/router";

export default {
  namespaced: true,
  state: {
    token: getToken() || "",
  },
  mutations: {
    updateToken(state, val) {
      state.token = val;
      setToken(val);
    },
  },
  actions: {
    async login(store, data) {
      try {
        const res = await loginAPI({
          username: data.username,
          password: data.password,
        });
        store.commit("updateToken", res.data.token);
        // 记住账号判断
        if (data.remember) {
          setRemember(JSON.stringify(data));
        } else {
          delRemember();
        }
        // 跳转回首页/跳转退出登录前的页面
        router.push(router.currentRoute.query.redirect || "/");
        Message.success("登录成功.");
      } catch (err) {
        if (err.response.data) {
          Message.error(err.response.data.msg);
        } else {
          Message.error("网络异常,请稍后再试.");
        }
      }
    },
  },
};
