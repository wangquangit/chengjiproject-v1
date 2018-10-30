import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

Vue.config.productionTip = false
Vue.use(Avue);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
