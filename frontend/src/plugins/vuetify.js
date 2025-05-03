// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles';  // Importa los estilos predeterminados de Vuetify

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',  // El tema por defecto (puedes cambiar a dark)
  },
});

export default vuetify;
