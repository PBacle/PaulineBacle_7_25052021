import { createRouter, createWebHashHistory } from 'vue-router'
import UserAccount from '../views/User.vue';
import Home from '../views/Home.vue';
import OnePost from '../views/OnePost.vue';
import SignUpForm from '../views/Signup.vue';

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
    component: SignUpForm
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
