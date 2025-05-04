const express = require('express');
const cors = require('cors');
const { sequelize, User, Group, GroupMembers } = require('./models'); // Correctamente importando desde models/index.js
const authRoutes = require('./routes/authRoutes'); // Importa las rutas de autenticación
const groupRoutes = require('./routes/groupRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test de conexión
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión con la base de datos exitosa');
  })
  .catch(err => {
    console.error('❌ No se pudo conectar con la base de datos:', err);
  });

// Sincronizar los modelos (esto crea las tablas si no existen)
sequelize.sync({ force: false })  // Set force: true para forzar la recreación de tablas (¡Usa con precaución!)
  .then(() => {
    console.log('✅ Base de datos sincronizada');
  })
  .catch(err => {
    console.error('❌ Error al sincronizar la base de datos:', err);
  });

// Usar las rutas de autenticación
app.use('/api/auth', authRoutes); // Esto permitirá que todas las rutas de autenticación comiencen con /api/auth
app.use('/api/groups', groupRoutes);

// Rutas de prueba
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend 🎉' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
