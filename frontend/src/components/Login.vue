<template>
    <div class="flex min-h-screen justify-center items-center bg-gray-50">
      <div class="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-6">Iniciar sesión</h2>
        <form @submit.prevent="handleLogin">
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
            Iniciar sesión
          </button>
          <p class="mt-4 text-center text-sm text-gray-500">
            ¿No tienes una cuenta? <router-link to="/register" class="text-blue-500 hover:underline">Regístrate</router-link>
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
        email: '',
        password: '',
      };
    },
    methods: {
      async handleLogin() {
        try {
          const response = await axios.post('http://localhost:3000/api/auth/login', {
            email: this.email,
            password: this.password,
          });
  
          // Guardar el token en localStorage (o en un lugar seguro)
          localStorage.setItem('token', response.data.token);
  
          // Redirigir al usuario a la página principal después de un login exitoso
          this.$router.push('/home');  // Cambia 'home' por la ruta correspondiente
  
        } catch (error) {
          console.error('Error al iniciar sesión:', error.response?.data?.message || error.message);
          alert('Error al iniciar sesión: ' + (error.response?.data?.message || error.message));
        }
      },
    },
  };
  </script>
  