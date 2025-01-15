import './assets/main.css'

import { markRaw } from 'vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin, defaultConfig } from '@formkit/vue'
import config from '../formkit.config'
import VueGtag from "vue-gtag";
import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia()
pinia.use(({ store }) => (store.$router = markRaw(router)))

app.use(router)
app.use(pinia)

const gTag = import.meta.env?.VITE_GOOGLE_TAG_ID || import.meta.env?.GOOGLE_TAG_ID
if (gTag) {
    app.use(VueGtag, {
        config: { id: gTag },
    });
}
app.use(plugin, defaultConfig(config))

router.isReady().then(() => app.mount('#app'))
