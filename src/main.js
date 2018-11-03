import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

Vue.config.productionTip = false
Vue.use(Avue);
Vue.use(ElementUI);


axios.defaults.headers.common['authorization'] = sessionStorage.getItem('token')
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

Vue.prototype.$axios = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
