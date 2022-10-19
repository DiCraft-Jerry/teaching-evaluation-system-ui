import { createStore } from 'vuex'

import userStore from '../store/userStore'
import routerStore from './mobile/routerStore'
import offerStore from './mobile/offerStore'

export default createStore({
  modules: {
	userStore,routerStore,offerStore
  }
})