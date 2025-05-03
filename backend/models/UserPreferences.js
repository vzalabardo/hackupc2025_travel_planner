module.exports = (sequelize, DataTypes) => {
    const UserPreferences = sequelize.define('UserPreferences', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      origin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      climate: {
        type: DataTypes.JSONB,  // Un array de climas seleccionados
        allowNull: false
      },
      activities: {
        type: DataTypes.JSONB,  // Un array de actividades seleccionadas
        allowNull: false
      },
      budget: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      nightLife: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      ecoFriendly: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    });
  
    UserPreferences.associate = (models) => {
      UserPreferences.belongsTo(models.GroupMembers, {
        foreignKey: 'groupMemberId',
        as: 'groupMember'
      });
    };
  
    return UserPreferences;
  };
  