<template>
  <div class="join-group-container">
    <div class="join-form">
      <h1 class="title">Unirse a un Grupo 🤝</h1>
      <p class="subtitle">Introduce el código del grupo para unirte 📲</p>

      <form @submit.prevent="joinGroup" class="form">
        <div class="input-group">
          <input
            id="groupCode"
            type="text"
            v-model="groupCode"
            required
            placeholder="Ej. ABCD1234"
            class="input"
          />
        </div>

        <button type="submit" class="btn-submit">Unirse al Grupo</button>
      </form>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const groupCode = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const router = useRouter(); // Para redirigir después de unirse al grupo

const joinGroup = async () => {
  try {
    const token = localStorage.getItem('token'); // Obtiene el token del usuario (suponiendo que lo guardaste en localStorage)

    if (!token) {
      errorMessage.value = 'No estás autenticado. Por favor, inicia sesión.';
      return;
    }

    // Realizamos la solicitud para unir al grupo usando el código
    const response = await axios.post(`http://localhost:3000/api/groups/${groupCode.value}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` } // Mandamos el token en los headers
    });

    successMessage.value = response.data.message; // Si todo salió bien, mostramos el mensaje de éxito
    errorMessage.value = '';

    // Redirigir al usuario a la página del grupo o página principal después de unirse
    setTimeout(() => {
      router.push(`Home`); // Redirige al usuario a la página del grupo con el código
    }, 1500); // Se espera un segundo para mostrar el mensaje de éxito antes de redirigir

  } catch (error) {
    // Si ocurre un error, mostramos el mensaje de error correspondiente
    errorMessage.value = error.response?.data?.message || 'Hubo un problema al intentar unirte al grupo';
    successMessage.value = '';
  }
};
</script>

<style scoped>
/* Diseño general */
.join-group-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  background-color: #f4f7fc;
  padding: 2rem;
  padding-top: 5rem; /* Asegura que el contenedor esté más arriba */
}

.join-form {
  background-color: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.join-form:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  text-align: left;
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.input {
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: border 0.3s;
}

.input:focus {
  border: 1px solid #007bff;
  outline: none;
}

.btn-submit {
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.success {
  color: green;
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
