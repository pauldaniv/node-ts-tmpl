'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const {dbConf} = require('../../config/app-config');

const db = {
  example: undefined,
  notification: undefined,
  userNotification: undefined,
  user: undefined
};

const sequelize = new Sequelize(dbConf.database, dbConf.username, dbConf.password, {
  ...dbConf,
  hooks: {
    afterInit: function (sequelize) {
      sequelize.options.handleDisconnects = false;

      // Disable pool completely
      sequelize.connectionManager.pool.clear();
      sequelize.connectionManager.pool = null;
      sequelize.connectionManager.getConnection = function getConnection() {
        return this._connect(sequelize.config);
      };
      sequelize.connectionManager.releaseConnection = function releaseConnection(connection) {
        return this._disconnect(connection);
      };
    }
  }
});

fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
