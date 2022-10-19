export default {
	namespaced: true,
	state: () => ({
		resources: '',
	}),
	mutations: {
		addResource(state, item) {
			state.resources = item
		},
		cleanrResource(state){
			state.resources = []
		},
	}
}

