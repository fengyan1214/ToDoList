import axios from "axios";
import store from "@/store";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// ========== 请求拦截器 ==========
request.interceptors.request.use(
  (config) => {
    // 从 Redux store 读取 token
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ========== 响应拦截器 ==========
request.interceptors.response.use(
  (response) => {
    // 直接返回 data，省去每次 .then(res => res.data)
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // token 过期或无效，清掉并跳转登录页
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default request;
