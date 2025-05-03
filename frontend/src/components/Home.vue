<template>
  <div class="home-container">
    <div class="home-card">
      <h1 class="title">Tus Grupos 👫</h1>

      <div v-if="groups.length" class="group-list">
        <div class="group-item" v-for="group in groups" :key="group.id">
          <div class="group-info">
            <h2>{{ group.name }} 🏕️</h2>
            <p>{{ group.description }}</p>
          </div>
          <button @click="goToGroup(group.id)" class="button view-group">👀 Ver Grupo</button>
        </div>
      </div>

      <div v-else>
        <p>No tienes grupos. Únete a uno o crea uno nuevo. 🤔</p>
      </div>

      <div class="action-buttons">
        <button @click="joinGroup" class="button join-group">🤝 Unirte a un Grupo</button>
        <button @click="createGroup" class="button create-group">➕ Crear un Grupo</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      groups: [], // Aquí se almacenarán los grupos obtenidos
    };
  },
  mounted() {
    // Llamada a la API para obtener los grupos del usuario cuando el componente se monta
    this.fetchUserGroups();
  },
  methods: {
    async fetchUserGroups() {
      try {
        // Hacer la solicitud GET al backend para obtener los grupos del usuario
        const response = await axios.get('http://localhost:3000/api/groups/my-groups', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Suponiendo que tienes un token JWT
          },
        });

        // Asignar los grupos al estado
        this.groups = response.data.groups;
      } catch (error) {
        console.error('Error al obtener los grupos:', error);
      }
    },
    goToGroup(groupId) {
      // Redirigir al grupo con ID específico
      this.$router.push({ name: 'GroupPage', params: { id: groupId } });
    },
    joinGroup() {
      // Redirigir a la página de unirse a un grupo
      this.$router.push({ name: 'JoinGroup' });
    },
    createGroup() {
      // Redirigir a la página de creación de grupo
      this.$router.push({ name: 'CreateGroup' });
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding-top: 20px;
  background-color: #f4f7fa;
}

.home-card {
  background-color: white;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.home-card:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.title {
  font-size: 2.5rem;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.group-list {
  margin-top: 20px;
}

.group-item {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.group-info {
  font-size: 1.1rem;
  color: #555;
}

.group-item h2 {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 8px;
}

.group-item p {
  font-size: 1rem;
  color: #666;
}

.button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 1.1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.view-group {
  background-color: #007bff;
}

.view-group:hover {
  background-color: #0056b3;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.action-buttons button {
  flex: 1;
  margin: 0 10px;
}

.action-buttons button:first-child {
  margin-left: 0;
}

.action-buttons button:last-child {
  margin-right: 0;
}

@media (max-width: 768px) {
  .home-card {
    width: 100%;
    margin: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    margin-bottom: 15px;
  }
}
</style>
