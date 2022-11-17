export default({
	namespaced: true,
	state: {
        studyData: '',
        warningMessage: ''
	},
	getters: {
		
	},
	mutations: {
        setStudyData (state, data) {
            state.studyData = data
        },

        updateIOTTagConfig(state, data) {
            state.studyData = data
        },

        setWarningMessage(state, data) {
            state.warningMessage = data
        },

        updateWarningMessage(state, data) {
            state.warningMessage = data
        }
	},
	actions: {
        updateIOTTagConfig ({ commit, state }, data) {
            commit('updateIOTTagConfig', data)
        },

        updateWarningMessage ({ commit, state }, data) {
            commit('updateWarningMessage', data)
        }
	}
})