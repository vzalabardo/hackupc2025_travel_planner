module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startDate: {  // Nuevo campo para la fecha de inicio
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {    // Nuevo campo para la fecha de fin
      type: DataTypes.DATE,
      allowNull: false,
    },
    adminId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  });

  Group.associate = (models) => {
    Group.belongsToMany(models.User, {
      through: models.GroupMembers,
      foreignKey: 'groupId',
      as: 'UserGroups'
    });
    Group.hasMany(models.GroupMembers, { foreignKey: 'groupId' });
  };

  return Group;
};
