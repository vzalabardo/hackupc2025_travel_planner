<template>
  <div class="recommendations-container">
    <h1 class="title">Destinos recomendados para tu grupo 🌍</h1>

    <div v-if="recommendations.length > 0" class="recommendations-list">
      <!-- Recomendaciones ordenadas por calificación -->
      <div
        v-for="(recommendation, index) in sortedRecommendations"
        :key="index"
        :class="['recommendation-card', { 'first-place': index === 0 }]"
      >
        <img
          v-if="recommendation.image_url"
          :src="recommendation.image_url"
          alt="Destination Image"
          class="destination-image"
        />

        <!-- Posición del destino dentro de un círculo -->
        <div class="rank-circle" :class="{ 'first-place': index === 0 }">
          <!-- Mostrar la corona en lugar del número en la primera posición -->
          <span v-if="index === 0" class="crown">👑</span>
          <span v-else>{{ index + 1 }}</span> <!-- Número de ranking para otras posiciones -->
        </div>

        <h2 class="destination-name">{{ recommendation.destination }}</h2>
        <p class="destination-description">{{ recommendation.description }}</p>

        <!-- Mostrar precios de vuelo -->
        <div class="price-section">
          <h3>Precios estimados de vuelos</h3>
          <div v-for="(priceDetail, idx) in JSON.parse(recommendation.price_details)" :key="idx" class="price-detail">
            <p><strong>{{ priceDetail.origin }}:</strong> {{ priceDetail.price }}</p>
          </div>

          <!-- Botón de compra para ir a SkyScanner -->
          <a :href="`https://www.skyscanner.net/transport/flights/${recommendation.origin}/${recommendation.destination}/?adults=1`" 
             target="_blank" 
             class="buy-button">
            Buscar vuelos en SkyScanner ✈️
          </a>
        </div>

        <!-- Actividades -->
        <div class="activities">
          <div class="activity-list">
            <div
              v-for="(activity, idx) in JSON.parse(recommendation.matching_activities)"
              :key="idx"
              class="activity-item"
            >
              <span v-if="activity === 'beach'" class="activity-icon">🏖️</span>
              <span v-if="activity === 'hiking'" class="activity-icon">🥾</span>
              <span v-if="activity === 'nightlife'" class="activity-icon">🌃</span>
              <span v-if="activity === 'sightseeing'" class="activity-icon">🏰</span>
              {{ activity }}  
            </div>
          </div>
        </div>

        <!-- Votación -->
        <div class="vote-section">
          <p><strong>¿Te gusta este destino?</strong></p>
          <div class="rating">
            <button v-for="n in 10" :key="n" @click="voteDestination(recommendation, n)" class="rating-button">
              {{ n }}
            </button>
          </div>
          <p>Calificación: {{ recommendation.rating || 'No calificado' }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-recommendations">
      <p>No hay recomendaciones disponibles aún.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      recommendations: [],
      groupId: null,
      unsplashApiKey: 'l56sF-Pub7rRl36NwMxGf0I6ySK1D1QLY9mF3_jFLzs', 
    };
  },
  created() {
    this.groupId = this.$route.params.groupId;
    if (!this.groupId) {
      console.error('El groupId no está presente en la URL');
      return;
    }
    this.fetchRecommendations();
  },
  computed: {
    sortedRecommendations() {
      return this.recommendations.sort((a, b) => {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      });
    },
  },
  methods: {
    async fetchRecommendations() {
      try {
        const response = await axios.get(`http://localhost:3000/api/groups/recommendations`, {
          params: { groupId: this.groupId },
        });

        this.recommendations = response.data;

        this.recommendations.forEach(async (recommendation) => {
          if (!recommendation.image_url) {
            const image = await this.getUnsplashImage(recommendation.destination);
            recommendation.image_url = image;
          }
        });
      } catch (error) {
        console.error('Error al obtener las recomendaciones:', error);
        this.recommendations = [];
      }
    },

    async getUnsplashImage(destination) {
      try {
        const response = await axios.get(`https://api.unsplash.com/photos/random`, {
          params: {
            query: destination,
            client_id: this.unsplashApiKey,
            orientation: 'landscape',
          },
        });
        return response.data[0]?.urls?.regular;
      } catch (error) {
        console.error('Error al obtener imagen de Unsplash:', error);
        return 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
      }
    },

    voteDestination(recommendation, rating) {
      if (rating < 1 || rating > 10) return;
      recommendation.rating = rating;
      this.updateRatingOnServer(recommendation);
    },

    async updateRatingOnServer(recommendation) {
      try {
        await axios.put(`http://localhost:3000/api/groups/recommendations/${recommendation.id}`, {
          rating: recommendation.rating,
        });
        console.log('Calificación actualizada correctamente');
      } catch (error) {
        console.error('Error al actualizar la calificación:', error);
      }
    },
  },
};
</script>

<style scoped>
.recommendations-container {
  font-family: 'Arial', sans-serif;
  text-align: center;
  padding: 20px;
}

.title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #4a90e2;
}

.recommendations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 0;
}

.recommendation-card {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  width: 45%;
  max-width: 600px;
  margin: 10px;
  position: relative;
}

.recommendation-card.first-place {
  border: 3px solid #ffdd00;
  box-shadow: 0 4px 12px rgba(255, 221, 0, 0.3);
}

.rank-circle {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 30px;
  height: 30px;
  background-color: #ff9100;
  color: white;
  font-size: 18px;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.rank-circle.first-place {
  background-color: #ffdd00;
  box-shadow: 0 0 10px rgba(255, 221, 0, 0.6);
}

.crown {
  font-size: 20px;
}

.destination-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-top: 8px;
}

.destination-description {
  color: #666;
  font-size: 0.9rem;
  margin: 5px 0;
}

.price-section {
  margin-top: 15px;
  background-color: #f1f1f1;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price-section h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.price-detail {
  font-size: 1rem;
  color: #333;
}

.buy-button {
  background-color: #ff9100;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 1rem;
  text-decoration: none;
  display: inline-block;
  margin-top: 10px;
}

.buy-button:hover {
  background-color: #ff7800;
}

.activities {
  margin-top: 8px;
}

.activity-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-start;
}

.activity-item {
  font-size: 0.9rem;
  background-color: #e5e7eb;
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  margin: 4px;
}

.activity-icon {
  margin-right: 6px;
}

.destination-image {
  width: 100%;
  height: 140px;
  border-radius: 8px;
  object-fit: cover;
}

.vote-section {
  margin-top: 10px;
}

.rating-button {
  background-color: #4f46e5;
  color: white;
  padding: 4px 8px;
  margin: 3px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
}

.rating-button:hover {
  background-color: #3b3c92;
}

.no-recommendations {
  font-size: 1rem;
  color: #999;
}
</style>
