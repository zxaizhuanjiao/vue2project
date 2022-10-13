import router from '@/router'
export default({
	namespaced: true,
	state: {
		userInfo: {},
		token: ''
	},
	getters: {
		
	},
	mutations: {
		setUserInfo(state, userInfo) {
			// 这里的 `state` 对象是模块的局部状态
			state.userInfo = userInfo
		},
		
		setToken(state, token) {
			// 这里的 `state` 对象是模块的局部状态
			state.token = token
		},

		userLogout(state) {
			localStorage.clear();
			state.userInfo = {};
			state.token = ''
			router.push('/login')
		},
		
		userToIndex() {
			router.push('/')
		}
	},
	actions: {

	}
})