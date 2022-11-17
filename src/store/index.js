import Vue from 'vue'
import Vuex from 'vuex'
import themeData from './modules/themeData'
import pageRouterData from './modules/pageRouterData'
import createPersistedState from 'vuex-persistedstate'
import userData from './modules/userData.js'
import studyData from './modules/studyData.js'

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        themeData,
        pageRouterData,
        userData,
        studyData
    },
    state: {},
    mutations: {},
    // vuex持久化插件
    plugins: [createPersistedState(
        {storage: window.sessionStorage}
    )]
})
