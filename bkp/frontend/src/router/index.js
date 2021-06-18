import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Profiles from '../views/Profile.vue';
import OnePost from '../components/OnePost.vue';
import Posts from '../components/Posts.vue';

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
    path: '/profiles/:id',
      name: 'Profile',
      component: Profiles
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  base: process.env.BASE_URL,
  routes
})

export default router
