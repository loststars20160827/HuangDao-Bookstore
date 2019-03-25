import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: localStorage.getItem('username') ? localStorage.getItem('username') : '',
    password: localStorage.getItem('password') ? localStorage.getItem('password') : '',
    remember: localStorage.getItem('remember') ? localStorage.getItem('remember') : false,
    url: localStorage.getItem('url') ? localStorage.getItem('url') : '',
    order: JSON.parse(localStorage.getItem('order')) ? JSON.parse(localStorage.getItem('order')) : {}
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
      localStorage.setItem('username', username)
    },
    setPassword (state, password) {
      state.password = password
      localStorage.setItem('password', password)
    },
    setRemember (state, remember) {
      state.remember = remember
      localStorage.setItem('remember', remember)
    },
    setUrl (state, url) {
      state.url = url
      localStorage.setItem('url', url)
    },
    setOrder (state, order) {
      state.order = order
      localStorage.setItem('order', JSON.stringify(order))
    }
  }
})
