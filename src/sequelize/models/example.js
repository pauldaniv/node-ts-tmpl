'use strict';

module.exports = (sequelize, Sequelize) => {
  return sequelize.define('example', {
    id: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      field: 'key',
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    value: {
      field: 'value',
      allowNull: false,
      type: Sequelize.STRING
    },
    createdAt: {
      field: 'created_at',
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE
    }
  }, {tableName: 'example'});
};
