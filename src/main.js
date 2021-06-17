import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

window.API_HOST = 'https://t4-dating-api.azurewebsites.net';
if(window.location.hostname == 'localhost') window.API_HOST = 'http://localhost:3000';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
