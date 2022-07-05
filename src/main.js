import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router';
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import timeago from 'vue-timeago3';
import "./index.css";
const app = createApp(App)
app.use(createPinia())
app.use(router);
app.use(timeago)
app.use(Toast, {
    position: POSITION.TOP_CENTER
});
app.mount('#app')
