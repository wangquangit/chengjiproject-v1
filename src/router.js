import Vue from 'vue'
import Router from 'vue-router'
// import Home from './views/Home.vue'

Vue.use(Router)


const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('./components/login/index.vue')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('./components/index.vue'),
      children: [
        {
          path: 'index',
          name: 'index',
          component: () => import('./components/main/index.vue')
        },
        {
          path: 'dictype',
          name: 'dictype',
          component: () => import('./components/main/dictype.vue')
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('./components/main/role.vue')
        },
        {
          path: 'user',
          name: 'user',
          component: () => import('./components/main/user.vue')
        },
        {
          path: 'department',
          name: 'department',
          component: () => import('./components/main/sysdepartment.vue')
        },
        {
          path: 'systemparameter',
          name: 'systemparameter',
          component: () => import('./components/main/systemparameter.vue')
        }
      ]
    },
    {
      path: '*',
      component: () => import('./components/index.vue')
    }
  ]
})


export default router