import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import Antd from "ant-design-vue/es";
import 'ant-design-vue/dist/antd.css';
import 'assets/css/reset.css'

axios.defaults.baseURL = 'http://192.168.0.102:8081/api/'

// 通过axios请求拦截器添加token，保证拥有获取数据的权限
axios.interceptors.request.use(config => {
  // console.log(config);
  // 为请求头对象，添加token 验证的 Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config;
})

const app = createApp(App)
app.use(Antd)
app.use(store).use(store).use(router).mount('#app')
app.config.globalProperties.$axios = axios
app.provide('$axios', axios)

