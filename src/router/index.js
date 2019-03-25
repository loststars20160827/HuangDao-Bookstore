import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Login from '@/components/Login'
import Register from '@/components/Register'
import BookStore from '@/components/BookStore'
import Detail from '@/components/Detail'
import Cart from '@/components/Cart'
import UserPage from '@/components/UserPage'
import Information from '@/components/Information'
import Address from '@/components/Address'
import Orders from '@/components/Orders'
import BookList from '@/components/BookList'
import SubmitOrder from '@/components/SubmitOrder'
import ResetPassword from '@/components/ResetPassword'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/resetpassword',
      name: 'Resetpassword',
      component: ResetPassword
    },
    {
      path: '/bookStore',
      name: 'BookStore',
      component: BookStore,
      children: [{
        path: 'homepage',
        name: 'Homepage',
        component: Homepage
      }, {
        path: 'detail/:id',
        name: 'Detail',
        component: Detail
      }, {
        path: 'cart',
        name: 'Cart',
        component: Cart
      }, {
        path: 'submitorder',
        name: 'SubmitOrder',
        component: SubmitOrder
      }, {
        path: 'booklist/:id',
        name: 'BookList',
        component: BookList
      }, {
        path: 'userpage',
        name: 'UserPage',
        component: UserPage,
        children: [{
          path: 'information',
          name: 'Information',
          component: Information
        }, {
          path: 'orders',
          name: 'Orders',
          component: Orders
        }, {
          path: 'address',
          name: 'Address',
          component: Address
        }]
      }]
    }
  ]
})
