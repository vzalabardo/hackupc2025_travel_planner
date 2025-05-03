// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Ruta para el registro de un usuario
router.post('/register', register);

// Ruta para el login de un usuario
router.post('/login', login);

module.exports = router;
