'use strict';

module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define('user', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    fullName: {
      field: 'full_name',
      type: Sequelize.STRING,
      allowNull: false,
      duplicating: false
    },
    email: {
      type: Sequelize.STRING,
      duplicating: false
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      field: 'created_at',
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  Users.associate = (models) => {
    Users.belongsToMany(models.notification, {
      through: {
        model: models.userNotification,
        unique: false,
      },
      as: 'notifications',
      foreignKey: 'user_id'
    });
  };
  return Users;
};
