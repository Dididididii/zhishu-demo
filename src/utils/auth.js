// 专门用来操作cookie的方法包
// 内部封装了繁琐的操作方法 参数处理 暴露三个函数 get,set,remove
import Cookies from "js-cookie";
import { TOKEN_KEY, REMEMBER_KEY } from "@/constants/KEY";
// 获取token的方法
export function getToken() {
  return Cookies.get(TOKEN_KEY);
}

// 设置token方法
export function setToken(token) {
  return Cookies.set(TOKEN_KEY, token);
}

// 删除token方法
export function removeToken() {
  return Cookies.remove(TOKEN_KEY);
}

// 获取REMEMBER_KEY方法
export function getRemember() {
  return Cookies.get(REMEMBER_KEY);
}

// 保存REMEMBER_KEY方法
export function setRemember(val) {
  return Cookies.set(REMEMBER_KEY, val);
}

// 删除REMEMBER_KEY方法
export function delRemember() {
  return Cookies.remove(REMEMBER_KEY);
}
