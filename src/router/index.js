import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import Index from '../views/Index.vue';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: Index
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name:'login',
    component: () => import('../views/Login.vue')
  },
]



const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  console.log('to',to);
  if(to.name == 'index' && to.query.token) next();
  else if (to.name == 'testAdmin') next();
  else if (to.name !== 'login' && (window.$cookies.get("auth") == null || window.$cookies.get("auth") == 'null')) next({ name: 'login' })
  else next()
})
export default router
