export default {
	namespaced: true,
	state: () => ({
		routerInfo: {}
	}),
	mutations: {
		setRouterInfo(state, item) {
			state.routerInfo = item
		},
		cleanrRouterInfo(state) {
			state.routerInfo = {}
		}
	}
}

