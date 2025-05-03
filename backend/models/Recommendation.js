module.exports = (sequelize, DataTypes) => {
    const Recommendation = sequelize.define('Recommendation', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      destination: {
        type: DataTypes.STRING(500), // Aumenta el tamaño de destino a 500 caracteres
        allowNull: false
      },
      description: {
        type: DataTypes.STRING(1000), // Aumenta el tamaño de descripción a 1000 caracteres
        allowNull: false
      },
      reason_for_recommendation: {
        type: DataTypes.STRING(1000), // Aumenta el tamaño de la razón a 1000 caracteres
        allowNull: false
      },
      matching_activities: {
        type: DataTypes.JSONB,  // Para almacenar las actividades como JSON
        allowNull: false
      },
      image_url: {
        type: DataTypes.STRING(2000), // Aumenta el tamaño de la URL de la imagen
        allowNull: true
      },
      price_details: {
        type: DataTypes.JSONB,  // Almacenar detalles del precio por origen
        allowNull: true
      },
      climate: {
        type: DataTypes.STRING(500), // Aumenta el tamaño de climate a 500 caracteres
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
    };

    return Recommendation;
};
