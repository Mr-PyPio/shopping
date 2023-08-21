import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'

const Home = () => import('views/home.vue')
const Login = () => import('views/login.vue')
const ProductList = () => import('components/product/productList.vue')
const ProductDetail = () => import('components/product/productDetail.vue')
const SpecialPage = () => import('components/specialPage/specialPage.vue')
const Banner = () => import('components/banner/bannerList.vue')
const Catalog = () => import('components/catalog/catalogList.vue')
const BannerDetail = () => import('components/banner/bannerDetail.vue')
const CatalogDetail = () => import('components/catalog/catalogDetail.vue')
const Category = () => import('components/category/categoryList.vue')
const List = () => import('views/list.vue')
const UserList = () => import('components/list/user-list.vue')
const OrderList = () => import('components/list/order-list.vue')

const routes = [
  {
    path: '/',
    redirect: 'home.html'
  },
  {
    name: 'Home',
    path: '/home.html',
    component: Home,
    children: [
      {
        path: '/section.html',
        component: ProductList,
      },
      {
        path: '/section/:ids.html',
        component: ProductDetail,
      },
      {
        path: '/specialPage.html',
        component: SpecialPage,
      },
      {
        path: '/banner.html',
        component: Banner
      },
      {
        path: '/banner/banner-:ids.html',
        component: BannerDetail,
      },
      {
        path: '/catalog.html',
        component: Catalog,
      },
      {
        path: '/catalog/catalog-:ids.html',
        component: CatalogDetail,
      },
      {
        path: '/category.html',
        component: Category,
      },
    ]
  },
  {
    name: 'List',
    path: '/list.html',
    component: List,
    children: [
      {
        name: 'user',
        path: '/user-list.html',
        component: UserList
      },
      {
        name: 'order',
        path: '/order-list.html',
        component: OrderList
      }
    ]
  },
  {
    name: 'Loging',
    path: '/login.html',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// to 将要访问的路径  form 代表从哪个路径跳转而来  next 是一个函数，表示放行（next() 放行  或 next('/login') 强制跳转

/* eslint-disable */
router.beforeEach(async (to) => {
  const userName = window.localStorage.getItem('userName') ?? ''
  const token = window.localStorage.getItem('userLoginToken') ?? ''
  if (to.name != 'Login') {
    // 没有token，强制跳转到登录页=
    const tokenStr = window.localStorage.getItem('userLoginToken')
    if (tokenStr) {
      const { data: res } = await axios.post('loginStatus', { token: token, username: userName })
      if (res.status == '400' || res.msg == '已过期') {
        return '/login.html'
      }
    } else {
      return '/login.html'
    }
  }
})
/* eslint-disable */
export default router
