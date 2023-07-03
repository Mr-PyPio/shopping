import { createStore } from 'vuex'
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.0.102:8081/api/'

export default createStore({
  state: {
    //登录状态
    isLogin: false,
    //用户名
    userName: ''
  },
  getters: {
    getLoginStatus(state) {
      return state.isLogin
    }
  },
  mutations: {
    saveLoginStatus(state, payload) {
      state.isLogin = payload
    },
  },
  actions: {
    // 保存登录用户信息
    async updateLoginStatus(context, userName) {
      const token = window.localStorage.getItem('userLoginToken') ?? ''
      const { data: res } = await axios.post('loginStatus', { token: token, username: userName })
      if (res.status === 200) {
        context.commit('saveLoginStatus', true)
      } else if (res.status === 400) {
        context.commit('saveLoginStatus', false)
      }
    },
  },
  modules: {
  }
})
