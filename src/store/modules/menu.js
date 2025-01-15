import { getProfileAPI } from "@/api/user";
import { routes, resetRouter } from "@/router";

export default {
  namespaced: true,
  state: {
    permissions: [],
    menuList: [],
  },
  mutations: {
    setPermissions(state, payload) {
      state.permissions = payload;
    },
    setMenuList(state, payload) {
      state.menuList = [...routes, ...payload];
    },
    clearMenuList(state) {
      state.menuList = [];
      resetRouter();
    },
  },
  actions: {
    async getPermissions(store) {
      const res = await getProfileAPI();
      //   console.log(res);
      store.commit("setPermissions", res.data.permissions);
      return res.data.permissions;
    },
  },
  getters: {},
};
