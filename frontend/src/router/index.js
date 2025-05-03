import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import Home from '../components/Home.vue'; // Asegúrate de importar la página Home
import CreateGroup from '../components/CreateGroup.vue'; // Asegúrate de importar la página CreateGroup
import GroupPage from '../components/GroupPage.vue'; // Asegúrate de importar la página GroupPage
import JoinGroup from '../components/JoinGroup.vue'; // Asegúrate de importar la página Group
import Quiz from '../components/Quiz.vue'; // Asegúrate de importar la página Quiz
import Recommendations from '../components/Recommendations.vue'; // Asegúrate de importar la página Recommendations


const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
      // Si el usuario está logueado, redirige a la home
      const token = localStorage.getItem('token');
      if (token) {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
      // Si el usuario está logueado, redirige a la home
      const token = localStorage.getItem('token');
      if (token) {
        next({ name: 'Home' });
      } else {
        next();
      }
    }
  },
  {
    path: '/',
    redirect: '/login',  // Redirige a Login por defecto
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
      // Verifica si el usuario tiene un token para acceder
      const token = localStorage.getItem('token');
      if (token) {
        next();
      } else {
        next({ name: 'Login' }); // Redirige a login si no está autenticado
      }
    }
  },{
    path: '/create-group',
    name: 'CreateGroup',
    component: CreateGroup,  // Ruta para crear un grupo
  },
  {
    path: '/group/:id',  // Usa :id para capturar el ID del grupo
    name: 'GroupPage',
    component: GroupPage,
    props: true  // Esto pasa el ID del grupo como una prop al componente
  },
  {
    path: '/join-group',  // Nueva ruta para unirse a un grupo
    name: 'JoinGroup',
    component: JoinGroup,  // Asocia el componente JoinGroup
  }
  ,
  {
    path: '/quiz/:groupId',  // Nueva ruta para unirse a un grupo
    name: 'Quiz',
    component: Quiz,  // Asocia el componente JoinGroup
    props: true
  },    {
    path: '/recommendation/:groupId',
    name: 'Recommendations',
    component: Recommendations,
  },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes, // Las rutas definidas
});

export default router;
