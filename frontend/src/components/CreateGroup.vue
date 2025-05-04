<template>
  <div class="create-group-container">
    <h2>Crear un nuevo grupo</h2>

    <form @submit.prevent="submitForm" class="create-group-form">
      <div class="form-group">
        <label for="groupName">Nombre del grupo</label>
        <input
          type="text"
          id="groupName"
          v-model="groupName"
          placeholder="Ej: Vacaciones 2025"
          required
        />
      </div>

      <div class="form-group">
        <label for="groupDescription">Descripción del grupo (opcional)</label>
        <textarea
          id="groupDescription"
          v-model="groupDescription"
          placeholder="Escribe una breve descripción"
        ></textarea>
      </div>

      <div class="form-group">
        <label for="startDate">Fecha de inicio del viaje</label>
        <input
          type="date"
          id="startDate"
          v-model="startDate"
          required
        />
      </div>

      <div class="form-group">
        <label for="endDate">Fecha de fin del viaje</label>
        <input
          type="date"
          id="endDate"
          v-model="endDate"
          required
        />
      </div>

      <button type="submit" class="submit-btn">Crear Grupo</button>
    </form>
  </div>
</template>

  
  <<script>
  import axios from 'axios'; // 👈 importa axios
  
  export default {
    data() {
      return {
        groupName: "",
        groupDescription: "",
        startDate: "",   // Agregado para la fecha de inicio
        endDate: "",     // Agregado para la fecha de fin
      };
    },
    methods: {
      async submitForm() {
        try {
          const token = localStorage.getItem('token');
  
          const response = await axios.post(
            'http://localhost:3000/api/groups',
            {
              name: this.groupName,
              description: this.groupDescription,
              startDate: this.startDate,  // Enviamos la fecha de inicio
              endDate: this.endDate,      // Enviamos la fecha de fin
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
  
          console.log('✅ Grupo creado:', response.data);
  
          this.$router.push({ name: 'Home'}); // Redirige a la página del grupo (crea esta vista después)
        } catch (error) {
          console.error('❌ Error al crear el grupo:', error);
          alert('Error al crear el grupo: ' + (error.response?.data?.message || error.message));
        }
      }
    },
  };
  </script>
  
  
  
  <style scoped>
  .create-group-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px;
    background-color: #f9f9f9; /* Fondo más suave */
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333; /* Texto oscuro */
  }
  
  .create-group-form {
    display: flex;
    flex-direction: column;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    font-size: 16px;
    font-weight: bold;
    color: #555; /* Color más suave para los labels */
  }
  
  input,
  textarea {
    width: 100%;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    background-color: #fff; /* Fondo blanco para inputs */
    font-size: 16px;
    margin-top: 5px;
    transition: border-color 0.3s ease;
  }
  
  input:focus,
  textarea:focus {
    border-color: #007bff; /* Cambia el borde cuando está enfocado */
    outline: none;
  }
  
  textarea {
    min-height: 120px;
    resize: vertical; /* Permitir que se redimensione */
  }
  
  button.submit-btn {
    padding: 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 18px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button.submit-btn:hover {
    background-color: #0056b3;
  }
  
  button.submit-btn:active {
    background-color: #004085;
  }
  </style>
  