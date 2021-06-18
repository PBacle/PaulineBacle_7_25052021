import { createRouter, createWebHashHistory } from 'vue-router'
import UserAccount from '../views/User.vue';
import Home from '../views/Home.vue';
import OnePost from '../components/OnePost.vue';

const routes = [
  {
    path: '/',
    alias: ['/posts','/users'],
    name: 'Home',
    component: Home,
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/posts/:id',
      name: 'OnePost',
      component: OnePost
  },
  {
    path: '/users/:id',
      name: 'User',
      component: UserAccount
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  base: process.env.BASE_URL,
  routes
})


export default router
