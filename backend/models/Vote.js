module.exports = (sequelize, DataTypes) => {
    const Vote = sequelize.define('Vote', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      rating: {
        type: DataTypes.INTEGER,  // O el tipo que uses
        allowNull: false
      },
      recommendationId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    });
  
    Vote.associate = (models) => {
      // Relación entre Vote y Recommendation
      Vote.belongsTo(models.Recommendation, { foreignKey: 'recommendationId' });
  
      // Relación entre Vote y User
      Vote.belongsTo(models.User, { foreignKey: 'userId' });
    };
  
    return Vote;
  };
  