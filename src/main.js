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


// axios.interceptors.response.use(data => {
//   if(data.data.code == 11){
//     return data
//   }
// },err => {
//   return err
// })



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
