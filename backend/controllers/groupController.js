
const { Group, GroupMembers, User } = require('../models');
const { v4: uuidv4 } = require('uuid');


exports.createGroup = async (req, res) => {
  const { name, description, startDate, endDate } = req.body;
  const adminId = req.user.id; // Este es el que estaba lanzando error

  try {
    const code = uuidv4().slice(0, 8); // Código único de 8 caracteres

    const newGroup = await Group.create({
      name,
      description,
      startDate,  // Fecha de inicio
      endDate,    // Fecha de fin
      adminId,
      code
    });

    // Registrar al creador como miembro del grupo
    await GroupMembers.create({
      userId: adminId,
      groupId: newGroup.id,
      hasCompletedPreferences: false
    });

    // Al crear el grupo, automáticamente se añade el creador como miembro
    const existingMembership = await GroupMembers.findOne({
        where: {
        userId: adminId, // El ID del usuario que crea el grupo
        groupId: newGroup.id, // El ID del grupo recién creado
        },
    });

    if (!existingMembership) {
        // Si el usuario no es ya miembro (aunque debería serlo), lo añadimos
        await GroupMembers.create({
        userId: adminId,
        groupId: newGroup.id,
        hasCompletedPreferences: false, // Puedes ajustar este valor según sea necesario
        });
    }

    res.status(201).json({ group: newGroup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hubo un error al crear el grupo' });
  }
};

exports.joinGroup = async (req, res) => {
    const userId  = req.user.id; // Aquí estamos extrayendo correctamente el id del token
    const { code } = req.params;
  
    console.log("User ID:", userId);  // Verifica que `userId` tenga el valor correcto
  
    try {
      // Buscar el grupo por su código
      const group = await Group.findOne({ where: { code } });
  
      if (!group) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }
  
      // Verificar si el usuario ya es miembro
      const existingMembership = await GroupMembers.findOne({
        where: {
          userId: userId, // Aquí ya estamos usando el userId correcto
          groupId: group.id,
        },
      });
  
      if (existingMembership) {
        return res.status(400).json({ message: 'Ya eres miembro de este grupo' });
      }
  
      // Agregar el usuario como miembro
      await GroupMembers.create({
        userId,
        groupId: group.id,
        hasCompletedPreferences: false, // Puedes ajustar esto según lo que desees
      });
  
      res.status(200).json({ message: 'Te has unido al grupo correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al unirte al grupo' });
    }
  };
  
  exports.getGroupData = async (req, res) => {
    const { groupId } = req.params; // El ID del grupo se pasa en la URL
  
    try {
      // Buscar el grupo por su ID
      const group = await Group.findOne({
        where: { id: groupId },
        include: [
          {
            model: User,
            as: 'UserGroups', // Aquí debe ser 'UserGroups', no 'Members'
            attributes: ['id', 'name'],
            through: {
              model: GroupMembers,
              attributes: ['hasCompletedPreferences']
            }
          }
        ]
      });
  
      if (!group) {
        return res.status(404).json({ message: 'Grupo no encontrado' });
      }
  
      // Construir la respuesta
      const groupData = {
        id: group.id,
        name: group.name,
        description: group.description,
        code: group.code,
        adminId: group.adminId,
        members: group.UserGroups.map(member => ({
          id: member.id,
          name: member.name,
          hasCompletedPreferences: member.GroupMembers.hasCompletedPreferences
        }))
      };
  
      res.status(200).json(groupData); // Devolver la información del grupo
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Hubo un error al obtener los datos del grupo' });
    }
  };