import Vue from 'vue'
import Vuex from 'vuex'
import themeData from './modules/themeData'
import pageRouterData from './modules/pageRouterData'
import createPersistedState from 'vuex-persistedstate'
import userData from './modules/userData.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        themeData,
        pageRouterData,
        userData
    },
    state: {},
    mutations: {},
    // vuex持久化插件
    plugins: [createPersistedState(
        {storage: window.sessionStorage}
    )]
})
