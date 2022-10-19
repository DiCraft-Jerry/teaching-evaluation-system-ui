import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import store from './store/index'
import { Lazyload } from 'vant';
import '@icon-park/vue-next/styles/index.css'

const app = createApp(App)
app.use(store).use(ElementPlus, { locale: zhCn }).use(router).use(Lazyload, {
    lazyComponent: true,
})
    .mount('#app')
