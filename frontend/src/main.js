import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';  // Importa la configuración de Vuetify
import './style.css';
import './assets/tailwind.css';

const app = createApp(App);

app.use(router);
app.use(vuetify);  // Usa Vuetify en la aplicación

app.mount('#app');  // Monta la app
