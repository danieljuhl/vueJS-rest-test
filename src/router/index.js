import Vue from 'vue';
import Router from 'vue-router';
import Single from '../components/Single';

Vue.use(Router);

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Homepage',
    //   component: Homepage,
    // },
    {
      path: '/coin/:id',
      name: 'Single',
      component: Single,
    },
  ],
});
