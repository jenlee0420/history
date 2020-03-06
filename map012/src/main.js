import Vue from 'vue'
import App from './App.vue'
import '../static/css/default.css'
import global from './js/animate';

Vue.config.productionTip = false
/* 全局变量，方法 */
Object.keys(global).forEach(key => {
  Vue.prototype[key] = global[key];
});

new Vue({
  render: h => h(App),
}).$mount('#app')
