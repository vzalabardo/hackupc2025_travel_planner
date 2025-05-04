module.exports = (sequelize, DataTypes) => {
    const Recommendation = sequelize.define('Recommendation', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      destination: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      reason_for_recommendation: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      matching_activities: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING(2000),
        allowNull: true
      },
      price_details: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      climate: {
        type: DataTypes.STRING(500),
        allowNull: true
      },
      groupId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    });
  
    Recommendation.associate = (models) => {
      // Relación entre Recommendation y Group
      Recommendation.belongsTo(models.Group, { foreignKey: 'groupId' });
  
      // Relación entre Recommendation y Vote
      Recommendation.hasMany(models.Vote, { foreignKey: 'recommendationId' });
    };
  
    return Recommendation;
  };
  