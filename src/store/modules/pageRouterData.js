export default({
  namespaced: true,
  state: {
    location: '',
    defaultSelectedKeys: '1',
  },
  getters: {},
  mutations: {
    setLocation (state, data) {
      state.location = data;
    },
    setDefaultSelectedKeys (state, data) {
      state.defaultSelectedKeys = data;
    },
  },
  actions: {}
})
