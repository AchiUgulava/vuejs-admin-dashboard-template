import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './pages/Dashboard.vue';
import Users from './pages/Users.vue';

const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/dashboard',
      component: Dashboard,
      
    },
    { 
      path: '/',
      redirect: '/users',
    },
    {
      path: '/users',
      component: Users,
    },
    {
      path: '/user/:usr/chat/:id',
      component: () => import('./pages/Chat.vue'),
      props: true,
    },
    {
      path: '/user/:usr', // :id is the wildcard parameter
      component: () => import('./pages/User.vue'), // Assuming you have a User.vue component
      props: true, // Pass route params as props to the component
    },
  ],
});

export default router;
