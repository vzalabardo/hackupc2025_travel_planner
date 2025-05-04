const { Sequelize, DataTypes } = require('sequelize');

// Usar las variables de entorno directamente
const sequelize = new Sequelize('postgres://postgres:Zala1234@localhost:5432/hackupc2025', {
  dialect: 'postgres',
  logging: false,
});

// Importar los modelos
const User = require('./User')(sequelize, DataTypes);
const Group = require('./Group')(sequelize, DataTypes);
const GroupMembers = require('./GroupMembers')(sequelize, DataTypes);
const UserPreferences = require('./UserPreferences')(sequelize, DataTypes);
const Recommendation = require('./Recommendation')(sequelize, DataTypes);  // Asegúrate de que este sea el path correcto
const Vote = require('./Vote')(sequelize, DataTypes);

// Asociaciones entre modelos
User.associate({ Group, GroupMembers, UserPreferences, Vote });
Group.associate({ User, GroupMembers, Recommendation });  // Añadir Recommendation aquí
GroupMembers.associate({ User, Group, UserPreferences });
UserPreferences.associate({ GroupMembers });
Recommendation.associate({ Vote, Group });
Vote.associate({ User, Recommendation });

// Exportar sequelize y los modelos
module.exports = { sequelize, User, Group, GroupMembers, UserPreferences, Recommendation, Vote };
