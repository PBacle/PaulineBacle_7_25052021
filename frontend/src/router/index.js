import { createRouter, createWebHashHistory } from 'vue-router'
import UserAccount from '../views/User.vue';
import Home from '../views/Home.vue';
import Posts from '../components/Posts.vue';
import OnePost from '../components/OnePost.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/posts/',
      name: 'Feed',
      component: Posts
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
