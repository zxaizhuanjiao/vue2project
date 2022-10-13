export default({
  namespaced: true,
  state: {
    themeValue: '#F26521',
    top: '0px',
    left: '0px'
  },
  getters: {},
  mutations: {
    setThemeValue (state, data) {
      if (data && data !== 'null') {
        state.themeValue = data;
      }
    },
    setTop (state, data) {
      state.top = data;
    },
    setLeft (state, data) {
      state.left = data;
    }
  },
  actions: {}
})
