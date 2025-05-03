<template>
  <div class="group-container">
    <!-- Encabezado del grupo -->
    <div class="group-header">
      <h1>{{ group.name }} 🎉</h1>
      <p class="group-description">{{ group.description }}</p>
      <div class="group-code">
        <span>Código del grupo: <strong>{{ group.code }}</strong></span>
        <button @click="copyCode" class="copy-button">📋 Copiar código</button>
      </div>
    </div>

    <!-- Lista de miembros -->
    <div class="members-section">
      <h2>Participantes ({{ group.members.length }}) 👥</h2>
      <ul>
        <li v-for="member in group.members" :key="member.id" class="member-item">
          <span class="avatar">{{ getInitials(member.name) }}</span>
          {{ member.name }}
          <span :class="{'status-completed': member.hasCompletedPreferences, 'status-pending': !member.hasCompletedPreferences}" class="status-text">
            {{ member.hasCompletedPreferences ? '✅ Completado' : '⏳ Pendiente' }}
          </span>
        </li>
      </ul>
    </div>

    <!-- Progreso del grupo -->
    <div class="progress-section">
      <p>{{ completedCount }} de {{ group.members.length }} miembros completaron sus preferencias</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
      </div>
    </div>

    <!-- Acciones -->
    <div class="actions">
      <button @click="goToPreferences" class="action-button">
        {{ currentUserHasPreferences ? '📝 Editar preferencias' : '📝 Añadir preferencias' }}
      </button>
      <button @click="shareGroup" class="action-button">🔗 Compartir grupo</button>
      <!-- Solo mostrar si es admin y todos completaron el cuestionario -->
      <button v-if="allCompleted" @click="startRecommendation" class="action-button">
        🔍 Generar Recomendaciones
      </button>
    </div>

    <!-- Botón para ver las recomendaciones después de generarlas -->
    <div v-if="recommendationsGenerated" class="actions">
      <button @click="goToRecommendations" class="action-button">
        Ver Recomendaciones
      </button>
    </div>

    <!-- Indicador de carga -->
    <div v-if="isLoading" class="loading-indicator">
      <p>Generando recomendaciones...</p>
      <div class="spinner"></div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const groupId = route.params.id
const router = useRouter()

const group = ref({
  name: '',
  description: '',
  code: '',
  members: [],
  adminId: ''
})

const currentUserId = 'USER_ID_ACTUAL' 

const isLoading = ref(false)
const recommendationsGenerated = ref(false)

const fetchGroupData = async () => {
  try {
    const { data } = await axios.post(
      'http://localhost:3000/api/groups/data',
      { groupId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )
    group.value = data
  } catch (error) {
    console.error('Error al obtener los datos del grupo:', error)
  }
}

onMounted(() => {
  fetchGroupData()
})

const getInitials = (name) => name.split(' ').map(w => w[0]).join('').toUpperCase()

const completedCount = computed(() => group.value.members.filter(m => m.hasCompletedPreferences).length)
const progressPercentage = computed(() => (completedCount.value / group.value.members.length) * 100)
const allCompleted = computed(() => completedCount.value === group.value.members.length)
const isAdmin = computed(() => group.value.adminId === currentUserId)

const currentUserHasPreferences = computed(() => {
  return group.value.members.some(member => member.id === currentUserId && member.hasCompletedPreferences)
})

const copyCode = () => {
  navigator.clipboard.writeText(group.value.code)
  alert('Código copiado al portapapeles')
}

const shareGroup = () => {
  const text = `¡Únete a mi grupo de viaje! Código: ${group.value.code}`
  if (navigator.share) {
    navigator.share({ text })
  } else {
    alert(text)
  }
}

const goToPreferences = () => {
  router.push({ name: 'Quiz', params: { groupId } })
}

const startRecommendation = async () => {
  isLoading.value = true  // Mostrar indicador de carga
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      'http://localhost:3000/api/groups/recommendations',
      { groupId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      recommendationsGenerated.value = true; // Activar botón de ver recomendaciones
      alert('Recomendaciones generadas con éxito!');
      setTimeout(() => {
        goToRecommendations()  // Redirigir automáticamente
      }, 2000); // Esperar 2 segundos antes de redirigir
    }
  } catch (error) {
    console.error('Error al generar recomendaciones:', error);
    alert('Hubo un error al generar las recomendaciones.');
  } finally {
    isLoading.value = false  // Ocultar el indicador de carga
  }
};

const goToRecommendations = () => {
  router.push(`/recommendation/${groupId}`);  // Redirigir a la página de recomendaciones
}
</script>


<style scoped>
.group-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

.group-header {
  border-bottom: 2px solid #ccc;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.group-header h1 {
  font-size: 2rem;
  color: #4A90E2;
  margin-bottom: 0.5rem;
}

.group-description {
  font-size: 1rem;
  color: #555;
}

.group-code {
  margin-top: 1rem;
  text-align: center;
}

.copy-button {
  background-color: #4CAF50;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
}

.copy-button:hover {
  background-color: #45a049;
}

.members-section {
  margin-bottom: 2rem;
}

.members-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.members-section ul {
  list-style: none;
  padding: 0;
}

.member-item {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background-color: #f1f1f1;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #007bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.status-text {
  margin-left: auto;
  font-weight: bold;
}

.status-completed {
  color: green;
}

.status-pending {
  color: orange;
}

.progress-section {
  margin-bottom: 2rem;
}

.progress-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #28a745;
  transition: width 0.3s ease;
}

.actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.action-button {
  background-color: #4A90E2;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #357ABD;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  font-size: 1.2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A90E2;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.action-button {
  background-color: #4A90E2;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #357ABD;
}
</style>
