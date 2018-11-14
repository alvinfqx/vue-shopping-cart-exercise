import Vue from "vue";
import Router from "vue-router";
import ShoppingCart from '../components/ShoppingCart';
import Address from '../components/Address';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ShoppingCart',
      component: ShoppingCart
    },
    {
      path: '/Address',
      name: 'Address',
      component: Address
    },

  ]
})

