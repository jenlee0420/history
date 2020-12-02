import Vue from 'vue'
import App from './App.vue'
import '../static/css/default.css'
import global from './js/animate';

Vue.config.productionTip = false
/* 全局变量，方法 */
Object.keys(global).forEach(key => {
  Vue.prototype[key] = global[key];
});
// import Vconsole from 'vconsole';
// let vConsole = new Vconsole();
// export default vConsole
new Vue({
  render: h => h(App),
}).$mount('#app')
