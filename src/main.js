import Vue from 'vue'
import App from './App.vue'
// 路由
import router from './router'
// vuex
import store from './store/index.js'
import Vuex from 'vuex'

// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI,{ size: 'small' });

import qs from 'qs'
Vue.prototype.qs = qs;

// 全局主题
import '../theme/index.css'

import './style/element_visiable.css'
import './style/common.css';

// echarts
import * as echarts from 'echarts';
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false;
Vue.use(Vuex);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
