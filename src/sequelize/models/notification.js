'use strict';

module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define('notification', {
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: Sequelize.STRING,
    },
    createdAt: {
      field: 'created_at',
      allowNull: false,
      type: Sequelize.DATE,
    }
  }, {
    tableName: 'notifications',
    timestamps: false
  });

  Notification.associate = (models) => {
    Notification.belongsToMany(models.user, {
      through: models.userNotification,
      as: 'belongsToUser',
      foreignKey: 'notification_id',
    });

    Notification.belongsTo(models.user, {
      foreignKey: {
        field: 'created_by',
        name: 'createdBy'
      },
    });
  };
  return Notification;
};
