import axios from "axios";
// 导入store
import store from "@/store";
// 导入消息提示组件
import { Message } from "element-ui";

const service = axios.create({
  baseURL: "https://api-hmzs.itheima.net/v1",
  timeout: 5000, // request timeout
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 判断是否存在token
    const token = store.state.user.token;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response.data) {
      Message.error(error.response.data.msg);
    } else {
      Message.error("网络异常,请稍后再试.");
    }
    return Promise.reject(error);
  }
);

export default service;
