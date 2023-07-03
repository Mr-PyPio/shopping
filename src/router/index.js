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
        path: '/banner/:ids.html',
        component: BannerDetail,
      },
      {
        path: '/catalog.html',
        component: Catalog,
      },
      {
        path: '/catalog/:ids.html',
        component: CatalogDetail,
      },
    ]
  },
  {
    name: 'Login',
    path: '/login.html',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// to 将要访问的路径  form 代表从哪个路径跳转而来  next 是一个函数，表示放行（next() 放行  或 next('/login') 强制跳转
router.beforeEach((to) => {
  if (to.name != 'Login') {
    const tokenStr = window.localStorage.getItem('userLoginToken')
    // 没有token，强制跳转到登录页
    if (tokenStr) {
      const userName = window.localStorage.getItem('userName') ?? ''
      const token = window.localStorage.getItem('userLoginToken') ?? ''
      axios.post('loginStatus', { token: token, username: userName })
        .then((res) => {
          if (res.data.status == 400 || res.data.msg == '已过期') {
            return { name: 'Login' }
          }
        })
    } else if (!tokenStr) {
      return { name: 'Login' }
    }
  }
})

export default router
