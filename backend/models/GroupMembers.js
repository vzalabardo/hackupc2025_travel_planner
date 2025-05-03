module.exports = (sequelize, DataTypes) => {
    const GroupMembers = sequelize.define('GroupMembers', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      hasCompletedPreferences: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      joinedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  
    GroupMembers.associate = (models) => {
      // Relaciones entre GroupMembers y User, y Group
      GroupMembers.belongsTo(models.User, { foreignKey: 'userId' });
      GroupMembers.belongsTo(models.Group, { foreignKey: 'groupId' });

      GroupMembers.hasOne(models.UserPreferences, { foreignKey: 'groupMemberId', as: 'userPreferences' });
    };
  
    return GroupMembers;
  };
  