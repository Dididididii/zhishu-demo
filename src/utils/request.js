import axios from "axios";
// 导入store
import store from "@/store";

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
    return Promise.reject(error);
  }
);

export default service;
