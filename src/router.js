import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './pages/Dashboard.vue';
import Users from './pages/Users.vue';

const routerHistory = createWebHistory();

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      component: Dashboard,
    },
    {
      path: '/users',
      component: Users,
    },
    {
      path: '/user/:id', // :id is the wildcard parameter
      component: () => import('./pages/User.vue'), // Assuming you have a User.vue component
      props: true, // Pass route params as props to the component
    },
    {
      path: '/user/:usr/chat/:id',
      component: () => import('./pages/Chat.vue'),
      props: true,
    },
  ],
});

export default router;
