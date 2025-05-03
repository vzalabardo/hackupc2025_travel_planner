module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    });
  
    User.associate = (models) => {
      // Relación entre User y Group con alias único
      User.belongsToMany(models.Group, {
        through: models.GroupMembers,
        foreignKey: 'userId',
        as: 'UserGroups' // Alias único
      });
    };
  
    return User;
  };
  