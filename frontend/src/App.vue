<template>
  <div class="app">
    <!-- Barra superior -->
    <header class="navbar">
      <div class="logo" @click="goHome">
        Travel Planner
      </div>
      <div class="logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i> <!-- Icono de log out (Font Awesome) -->
      </div>
    </header>

    <!-- Aquí se cargará el componente correspondiente a la ruta actual -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goHome() {
      this.$router.push('/'); // Redirige al inicio
    },
    logout() {
      // Lógica para cerrar sesión
      // Esto puede ser eliminando el token de autenticación o redirigiendo a un login, dependiendo de tu flujo
      localStorage.removeItem('authToken'); // Ejemplo si usas localStorage
      this.$router.push('/login'); // Redirige al login después de cerrar sesión
    }
  }
};
</script>

<style scoped>
/* Barra superior fija */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: white;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

/* Estilo para el logo de la barra */
.logo {
  font-size: 1.5rem;
  cursor: pointer;
  font-weight: bold;
  text-align: center;
  flex-grow: 1;
}

/* Estilo para el icono de logout */
.logout {
  cursor: pointer;
  font-size: 1.2rem;
}

.logout i {
  margin-right: 10px;
}

/* Espacio para la vista de contenido */
.app {
  margin-top: 50px; /* Para que el contenido no quede debajo de la barra */
}
</style>
