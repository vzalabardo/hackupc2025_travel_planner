<template>
  <div class="flex justify-center items-start min-h-screen bg-gray-100 py-8"> <!-- Cambié min-h-screen por py-8 -->
    <div class="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-center mb-6">¡Cuéntanos sobre tus preferencias de viaje! 🌍</h2>
      <form @submit.prevent="submitForm">
        <!-- Paso 1 -->
        <div v-if="currentStep === 1">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">¿Desde dónde viajas? ✈️</label>
            <input
              v-model="origin"
              type="text"
              class="w-full p-2 border border-gray-300 rounded-lg"
              placeholder="Ciudad o país de origen"
              required
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">¿Qué tipo de clima prefieres? ☀️🌧️</label>
            <div class="flex flex-wrap gap-4">
              <div v-for="option in climateOptions" :key="option" class="flex items-center">
                <input
                  type="checkbox"
                  v-model="selectedClimates"
                  :value="option"
                  class="mr-2"
                />
                <span>{{ option }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Paso 2 -->
        <div v-if="currentStep === 2">
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">¿Qué tipo de actividades prefieres? 🎨🏖️</label>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="activity in activitiesOptions"
                :key="activity.id"
                @click="toggleActivity(activity.id)"
                class="px-4 py-2 rounded-full border cursor-pointer transition duration-200 ease-in-out text-sm"
                :class="activities.includes(activity.id)
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-indigo-100'"
              >
                {{ activity.name }}
              </div>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">¿Cuál es tu presupuesto aproximado? 💸</label>
            <input
              v-model="budget"
              type="range"
              min="100"
              max="5000"
              step="50"
              class="w-full"
            />
            <p class="text-center mt-2">${{ budget }} USD</p>
          </div>
        </div>

        <!-- Paso 3 -->
        <div v-if="currentStep === 3">
          <div class="mb-4">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                v-model="nightLife"
                class="mr-2"
              />
              ¿Te interesa la vida nocturna? 🌙
            </label>
          </div>

          <div class="mb-6">
            <label class="flex items-center text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                v-model="ecoFriendly"
                class="mr-2"
              />
              ¿Prefieres un destino eco-amigable? 🌱
            </label>
          </div>
        </div>

        <div class="flex justify-between mt-6">
          <button 
            v-if="currentStep > 1" 
            type="button" 
            @click="prevStep" 
            class="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg"
          >
            Anterior
          </button>

          <button 
            v-if="currentStep < 3" 
            type="button" 
            @click="nextStep" 
            class="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Siguiente
          </button>

          <button 
            v-if="currentStep === 3" 
            type="submit" 
            class="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Enviar Preferencias 📨
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      groupId: null,
      currentStep: 1,
      origin: '',
      selectedClimates: [],
      activities: [],
      budget: 1000,
      nightLife: false,
      ecoFriendly: false,
      climateOptions: ['Cálido ☀️', 'Frío ❄️', 'Templado 🌤️', 'Tropical 🌴', 'Seco 🏜️'],
      activitiesOptions: [
        { id: 1, name: 'Playa 🏖️' },
        { id: 2, name: 'Senderismo 🥾' },
        { id: 3, name: 'Aventura 🧗' },
        { id: 4, name: 'Cultura 🏛️' },
        { id: 5, name: 'Arte y Museos 🎨' },
        { id: 6, name: 'Gastronomía 🍽️' },
        { id: 7, name: 'Vida nocturna 🌃' },
        { id: 8, name: 'Festivales 🎊' },
        { id: 9, name: 'Relax en spa 🧖' },
        { id: 10, name: 'Compras 🛍️' },
        { id: 11, name: 'Ecoturismo 🍃' },
        { id: 12, name: 'Yoga y meditación 🧘' },
        { id: 13, name: 'Cata de vinos 🍷' },
        { id: 14, name: 'Parques temáticos 🎢' },
        { id: 15, name: 'Voluntariado 🤝' },
      ],
    };
  },
  mounted() {
    this.groupId = this.$route.params.groupId;
    this.loadPreferences();
  },
  methods: {
    async loadPreferences() {
      const userId = 1; // Este es el ID del usuario actual, puedes obtenerlo dinámicamente
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3000/api/groups/preferences', {
          headers: { Authorization: `Bearer ${token}` },
          params: { groupId: this.groupId },
        });

        if (response.data) {
          const preferences = response.data;
          this.origin = preferences.origin;
          this.selectedClimates = preferences.climate;
          this.activities = preferences.activities;
          this.budget = preferences.budget;
          this.nightLife = preferences.nightLife;
          this.ecoFriendly = preferences.ecoFriendly;
        }
      } catch (error) {
        console.error('Error al cargar las preferencias:', error);
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    toggleActivity(id) {
      if (this.activities.includes(id)) {
        this.activities = this.activities.filter(a => a !== id);
      } else {
        this.activities.push(id);
      }
    },
    async submitForm() {
      const preferences = {
        origin: this.origin,
        climate: this.selectedClimates,
        activities: this.activities,
        budget: this.budget,
        nightLife: this.nightLife,
        ecoFriendly: this.ecoFriendly,
        groupId: this.groupId,
      };
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(
          'http://localhost:3000/api/groups/preferences',
          preferences,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert(response.data.message);
        this.$router.push({ name: 'GroupPage', params: { id: this.groupId } });
      } catch (error) {
        console.error('Error al guardar las preferencias:', error);
        alert('Hubo un error al enviar las preferencias.');
      }
    },
  },
};
</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  height: 8px;
  border-radius: 5px;
  background-color: #d1d5db;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4f46e5;
  border-radius: 50%;
  cursor: pointer;
}
input[type="range"]:focus {
  outline: none;
}
</style>
