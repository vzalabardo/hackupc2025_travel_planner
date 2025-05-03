<template>
    <div class="flex min-h-screen justify-center items-center bg-gray-50">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Crear cuenta</h2>
        <form @submit.prevent="handleRegister">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              v-model="name"
              type="text"
              id="name"
              required
              class="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre"
            />
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              v-model="email"
              type="email"
              id="email"
              required
              class="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@email.com"
            />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              v-model="password"
              type="password"
              id="password"
              required
              class="mt-2 p-3 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition duration-300"
          >
            Regístrate
          </button>
          <p class="mt-4 text-center text-sm text-gray-500">
            ¿Ya tienes una cuenta? <router-link to="/login" class="text-blue-500 hover:underline">Inicia sesión</router-link>
          </p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
      };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/register', {
            name: this.name,
            email: this.email,
            password: this.password,
          });
  
          // Guardar el token en localStorage (o donde prefieras)
          localStorage.setItem('token', response.data.token);
  
          // Redirigir al usuario al login o home
          this.$router.push('/login');
        } catch (error) {
          console.error('Error al registrar usuario:', error.response.data.message);
          alert('Error al registrar usuario: ' + error.response.data.message);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos personalizados si es necesario */
  </style>
  