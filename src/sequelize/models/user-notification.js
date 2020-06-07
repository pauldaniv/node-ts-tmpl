'use strict';

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('userNotification', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    seen: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    user: {
      field: 'user_id',
      type: Sequelize.BIGINT,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    notification: {
      field: 'notification_id',
      type: Sequelize.BIGINT,
      references: {
        model: 'notifications',
        key: 'id'
      }
    },
  }, {
    tableName: 'user_notifications',
    timestamps: false,
  });
};
