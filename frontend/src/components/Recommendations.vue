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
          <span v-if="index === 0" class="crown">👑</span>
          <span v-else>{{ index + 1 }}</span>
        </div>

        <h2 class="destination-name">{{ recommendation.destination }}</h2>
        <p class="destination-description">{{ recommendation.description }}</p>

        <!-- Mostrar precios de vuelo -->
        <div class="price-section">
          <h3>Precios estimados de vuelos</h3>
          <div v-for="(priceDetail, idx) in JSON.parse(recommendation.price_details)" :key="idx" class="price-detail">
            <p><strong>{{ priceDetail.origin }}:</strong> {{ priceDetail.price }}</p>
          </div>

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

        <!-- Mostrar votos de los usuarios -->
        <div class="votes-section">
          <p><strong>Votos de los usuarios:</strong></p>
          <ul>
            <li v-for="(vote, idx) in recommendation.votes" :key="idx">
              <strong>{{ vote.username }}:</strong> {{ vote.rating }}
            </li>
          </ul>
        </div>

        <!-- Mostrar puntuación promedio -->
        <div class="vote-section">
          <p><strong>Calificación promedio:</strong> {{ recommendation.averageRating }} ({{ recommendation.votesCount }} votos)</p>
          <div class="rating">
            <button v-for="n in 10" :key="n" @click="voteDestination(recommendation, n)" class="rating-button">
              {{ n }}
            </button>
          </div>
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
        console.log(this.groupId);
        const response = await axios.get('http://localhost:3000/api/groups/votes', {
          params: {
            groupId: this.groupId, // Pasamos el groupId en los parámetros de la URL
          }
        });

        this.recommendations = response.data; // Asumimos que la respuesta es una lista de recomendaciones

        this.recommendations.forEach(async (recommendation) => {
          if (!recommendation.image_url) {
            // Si deseas obtener una imagen de Unsplash, descomenta y implementa esta función
            // const image = await this.getUnsplashImage(recommendation.destination);
            // recommendation.image_url = image;
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

    // Método para votar por un destino
    async voteDestination(recommendation, rating) {
      if (rating < 1 || rating > 10) return; // Asegurarse de que el rating esté entre 1 y 10

      // Asignar la calificación seleccionada al destino recomendado
      recommendation.rating = rating;

      // Llamar a la función que actualizará el servidor
      this.updateRatingOnServer(recommendation);
      this.fetchRecommendations(); // Volver a cargar las recomendaciones para reflejar la nueva calificación
    },

    // Método para actualizar la calificación en el servidor
    async updateRatingOnServer(recommendation) {
      try {
        const token = localStorage.getItem('token');  // Obtener el token del localStorage

        // Comprobamos que haya un token
        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        // Configuración de los headers con el token
        const config = {
          headers: {
            Authorization: `Bearer ${token}`, // Incluimos el token en el encabezado
          },
        };

        // Hacemos la llamada POST solo con groupId, recommendationId y rating
        const response = await axios.post('http://localhost:3000/api/groups/votes', {
          groupId: this.groupId,               // ID del grupo
          recommendationId: recommendation.id,  // ID de la recomendación
          rating: recommendation.rating,        // La calificación elegida por el usuario
        }, config); // Incluimos la configuración de los headers con el token

        console.log('Calificación actualizada correctamente', response.data);
        // Aquí podrías actualizar la calificación promedio localmente si es necesario
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
.votes-section {
  margin-top: 15px;
}

.votes-section ul {
  list-style: none;
  padding: 0;
}

.votes-section li {
  font-weight: bold;
}
</style>
