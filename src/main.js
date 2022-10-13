import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import cryptos from './utils/crypto'
import global_variable from "./utils/global_variable"
// 路由
import router from './router'
// vuex
import store from './store/index.js'
import Vuex from 'vuex'

// elementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './style/element_visiable.css'
Vue.use(ElementUI,{ size: 'small' });

import qs from 'qs'
Vue.prototype.qs = qs;

// 全局主题
import '../theme/index.css'
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
