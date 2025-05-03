const express = require('express');
const { createGroup } = require('../controllers/groupController'); // Importamos el controlador
const { Group, GroupMembers, User } = require('../models');
const { UserPreferences } = require('../models');
const { Recommendation } = require('../models');  // Ajusta la ruta según tu estructura

const authenticate = require('../middleware/authenticate');
const router = express.Router();
const { getGroupData } = require('../controllers/groupController');
const axios = require('axios');
const { OpenAI } = require("openai");

// Ruta para crear un grupo
router.post('/', authenticate, createGroup);

// Unirse a un grupo con el código
router.post('/:code/join', authenticate, async (req, res) => {
    console.log(req);
  const  userId  = req.user.id; // Obtenemos el userId desde el middleware de autenticación
  const { code } = req.params;

  try {
    // Buscar el grupo por su código
    const group = await Group.findOne({ where: { code } });

    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Verificar si el usuario ya está en el grupo
    const existingMembership = await GroupMembers.findOne({
      where: {
        groupId: group.id,
        userId: userId,
      },
    });

    if (existingMembership) {
      return res.status(400).json({ message: 'Ya estás en este grupo' });
    }

    // Agregar el usuario al grupo
    await GroupMembers.create({
      userId,
      groupId: group.id,
      hasCompletedPreferences: false, // Se puede ajustar según sea necesario
    });

    res.status(200).json({ message: 'Te has unido al grupo correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al unirte al grupo' });
  }
});


router.get('/my-groups', authenticate, async (req, res) => {
    const userId = req.user.id; // El ID del usuario está en req.user debido al middleware de autenticación
  
    try {
      // Obtener todos los grupos a los que pertenece el usuario
      const groups = await Group.findAll({
        include: [{
          model: User,
          as: 'UserGroups', // Usamos 'UserGroups' aquí también
          where: { id: userId },
          required: true,
        }]
      });
  
      // Devolver los grupos
      res.status(200).json({ groups });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Hubo un error al obtener los grupos' });
    }
  });
  
  
// RECIBIR DATA DE UN GRUPO
router.post('/data', async (req, res) => {
    const { groupId } = req.body; // Obtener el groupId desde el cuerpo de la solicitud
  
    console.log('groupId recibido:', groupId); // Verifica que groupId esté llegando correctamente
  
    try {
      // Buscar el grupo por su ID
      const group = await Group.findOne({
        where: { id: groupId },
        include: [
          {
            model: User,
            as: 'UserGroups',  // Asegúrate de usar 'UserGroups' aquí
            attributes: ['id', 'name'],
            through: {
              model: GroupMembers,
              attributes: ['hasCompletedPreferences'],
            },
          },
        ],
      });
  
      if (!group) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }
  
      // Responder con la información del grupo
      const groupData = {
        id: group.id,
        name: group.name,
        description: group.description,
        code: group.code,
        adminId: group.adminId,
        members: group.UserGroups.map((member) => ({
          id: member.id,
          name: member.name,
          hasCompletedPreferences: member.GroupMembers.hasCompletedPreferences,
        })),
      };
  
      res.status(200).json(groupData); // Enviar los datos del grupo
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al obtener los datos del grupo' });
    }
  });
// Endpoint para guardar las preferencias del usuario
// Endpoint para guardar las preferencias del usuario
router.post('/preferences', authenticate, async (req, res) => {
  const userId = req.user.id; // Esto debería existir en el middleware de autenticación
  const groupId = req.body.groupId;

  if (!userId || !groupId) {
    return res.status(400).json({ message: 'Faltan los datos necesarios: userId o groupId' });
  }

  try {
    // Buscar el miembro del grupo (GroupMember) usando userId y groupId
    const groupMember = await GroupMembers.findOne({
      where: { userId, groupId },
    });

    // Verificar que el miembro del grupo fue encontrado
    if (!groupMember) {
      return res.status(404).json({ message: 'No se encontró el miembro del grupo' });
    }

    const groupMemberId = groupMember.id;
    console.log('groupMemberId:', groupMemberId);

    // Validar que el groupMemberId no sea undefined
    if (!groupMemberId) {
      return res.status(500).json({ message: 'ID de miembro del grupo no válido' });
    }

    // Buscar las preferencias del usuario, si existen
    let preferences = await UserPreferences.findOne({
      where: { groupMemberId }, // Utilizamos groupMemberId directamente
    });

    if (preferences) {
      // Si existen, las actualizamos
      preferences.origin = req.body.origin;
      preferences.climate = req.body.climate;
      preferences.activities = req.body.activities;
      preferences.budget = req.body.budget;
      preferences.nightLife = req.body.nightLife;
      preferences.ecoFriendly = req.body.ecoFriendly;
      
      // Guardar los cambios
      await preferences.save();
    } else {
      // Si no existen, las creamos
      preferences = await UserPreferences.create({
        origin: req.body.origin,
        climate: req.body.climate,
        activities: req.body.activities,
        budget: req.body.budget,
        nightLife: req.body.nightLife,
        ecoFriendly: req.body.ecoFriendly,
        groupMemberId, // Asociar las preferencias al miembro del grupo
      });
    }

    // Actualizar el estado 'hasCompletedPreferences' del miembro del grupo
    await groupMember.update({ hasCompletedPreferences: true });

    res.status(200).json({ message: 'Preferencias guardadas o actualizadas correctamente y miembro actualizado' });
  } catch (error) {
    console.error('Error al guardar o actualizar las preferencias:', error);
    res.status(500).json({ message: 'Error al guardar o actualizar las preferencias o al actualizar el miembro del grupo' });
  }
});


// Endpoint para obtener las preferencias de un usuario
router.get('/preferences', async (req, res) => {
  const { userId } = req.query;  // Recibimos el userId para saber qué preferencias devolver

  try {
    // Buscar las preferencias del usuario
    const preferences = await UserPreferences.findOne({
      where: { groupMemberId: userId }
    });

    if (preferences) {
      return res.status(200).json(preferences);
    } else {
      return res.status(404).json({ message: 'No se encontraron preferencias.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener las preferencias.' });
  }
});

 
// Función para hacer la consulta a GPT-3
// Función para hacer la consulta a GPT-3
const { createApi } = require('unsplash-js');


// Función para hacer la consulta a GPT-4 y generar las recomendaciones
async function getRecommendationsFromGPT(preferences) {
  const openAI_API_KEY = "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";
  
  const client = new OpenAI({
    apiKey: openAI_API_KEY
  });

  try {
    const prompt = `
      Basado en las siguientes preferencias del grupo, por favor genera 3 destinos recomendados para un viaje en avión, añade emoticonos en tus respuesta.
      Para cada destino y para cada origen de los miembros del grupo, también incluye un estimado aproximado del precio de un vuelo de ida y vuelta. Teniendo en cuenta las fechas indicadas.

      Preferencias del grupo: ${JSON.stringify(preferences)}

      La respuesta debe estar en formato JSON, de manera que tal cual la reciba la pueda parsear, ( que empieze asi siempre [ { "destination":) con la siguiente estructura estrictamente en este formato para cada destino recomendado, y con emoticonos incluidos:
      {
        "destination": "Nombre del destino",
        "description": "Descripción breve, menos de 200 caracteres",
        "reason_for_recommendation": "Razón por la cual se recomienda",
        "matching_activities": ["Lista de actividades recomendadas"],
        "price_range": [
          {
            "origin": "Ciudad de origen",
            "price": "Rango de precio estimado del vuelo de ida y vuelta (por ejemplo, '100 - 200 EUR')"
          },
          {
            "origin": "Otra ciudad de origen",
            "price": "Rango de precio estimado del vuelo de ida y vuelta (por ejemplo, '150 - 250 EUR')"
          }
        ]
      }
    `; 
    
    
    const response = await client.responses.create({
      model: "gpt-4.1",
      input: prompt,
    });

    const recommendationsText = response.output_text.trim();

    try {
      const recommendations = JSON.parse(recommendationsText);

      // Obtener la imagen de Unsplash para cada destino recomendado
      const recommendationsWithImages = await Promise.all(recommendations.map(async (rec) => {
        const imageUrl = await getUnsplashImage(rec.destination); // Obtener imagen desde Unsplash
        return {
          ...rec,
          image_url: imageUrl, // Añadir la URL de la imagen
        };
      }));

      return recommendationsWithImages;

    } catch (parseError) {
      console.error("Error al parsear la respuesta de GPT-4:", parseError);
      throw new Error("La respuesta de GPT-4 no tiene el formato correcto.");
    }

  } catch (error) {
    console.error('Error al obtener recomendaciones de GPT-4:', error);
    throw new Error('No se pudieron obtener recomendaciones');
  }
}

// Función para obtener la imagen desde Unsplash
async function getUnsplashImage(destination) {
  const unsplash = createApi({
    accessKey: 'l56sF-Pub7rRl36NwMxGf0I6ySK1D1QLY9mF3_jFLzs',  // Reemplaza esto con tu clave de acceso de Unsplash
    fetch: fetch,
  });

  try {
    const response = await unsplash.search.getPhotos({
      query: destination,
      perPage: 1, // Obtener solo una imagen
      orientation: 'landscape', // Puedes modificar esta opción si prefieres otro tipo de orientación
    });

    if (response.response.results.length > 0) {
      // Retornamos la URL de la primera imagen
      return response.response.results[0].urls.regular;
    } else {
      // Si no encontramos imágenes, devolvemos una imagen por defecto
      return 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';
    }
  } catch (error) {
    console.error('Error al obtener imagen de Unsplash:', error);
    return 'https://via.placeholder.com/600x400?text=Imagen+no+disponible'; // En caso de error, imagen predeterminada
  }
}

// Endpoint para recopilar las preferencias y generar las recomendaciones
router.post('/recommendations', async (req, res) => {
  const { groupId } = req.body;

  try {
    // Paso 1: Obtener el grupo para obtener las fechas de inicio y fin
    const group = await Group.findOne({
      where: { id: groupId },
      attributes: ['startDate', 'endDate'],  // Suponiendo que las fechas están en el modelo Group
    });

    if (!group) {
      return res.status(404).json({ message: 'Grupo no encontrado' });
    }

    // Paso 2: Recopilar las preferencias de todos los miembros del grupo
    const members = await GroupMembers.findAll({
      where: { groupId },
      include: [{ model: UserPreferences, as: 'userPreferences' }],
    });

    if (members.length === 0) {
      return res.status(400).json({ message: 'No hay miembros en el grupo' });
    }

    // Paso 3: Construir un objeto con las preferencias combinadas de todos los miembros
    const preferences = members.map(member => member.userPreferences);

    // Paso 4: Pasar las fechas del grupo y las preferencias a GPT
    const preferencesWithDates = {
      ...preferences,
      startDate: group.startDate,  // Incluimos las fechas del grupo
      endDate: group.endDate
    };

    // Paso 5: Enviar las preferencias y fechas a GPT para obtener recomendaciones
    const recommendations = await getRecommendationsFromGPT(preferencesWithDates);

    // Validar que las recomendaciones tengan la estructura correcta
    if (!Array.isArray(recommendations)) {
      return res.status(400).json({ message: 'La respuesta de GPT no tiene el formato correcto.' });
    }

    // Paso 6: Crear las recomendaciones en la base de datos
    const createdRecommendations = await Promise.all(recommendations.map(async (rec) => {
      return Recommendation.create({
        groupId,
        destination: rec.destination || '',
        description: rec.description || '',
        reason_for_recommendation: rec.reason_for_recommendation || '',
        matching_activities: JSON.stringify(rec.matching_activities || []),
        image_url: rec.image_url || '',
        price_details: JSON.stringify(rec.price_range || []),
        climate: rec.climate || '',
      });
    }));

    // Devolver las recomendaciones creadas
    res.status(200).json(createdRecommendations);

  } catch (error) {
    console.error('Error al generar recomendaciones:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// Endpoint para obtener todas las recomendaciones de un grupo específico
router.get('/recommendations', async (req, res) => {
  const { groupId } = req.query;

  try {
    const recommendations = await Recommendation.findAll({
      where: { groupId },
    });

    if (recommendations.length === 0) {
      return res.status(404).json({ message: 'No hay recomendaciones para este grupo' });
    }

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error al obtener recomendaciones:', error);
    res.status(500).json({ message: 'Error al obtener recomendaciones', error: error.message });
  }
});

module.exports = router;
