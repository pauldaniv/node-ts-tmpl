
import { QueryInterface, DataTypes, Sequelize } from "sequelize";

module.exports = {
  up: ({createTable}: QueryInterface) => {
    return createTable('example', {
      id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.BIGINT
      },
      key: {
        field: 'key',
        allowNull: false,
        type: DataTypes.STRING,
      },
      value: {
        field: 'value',
        allowNull: false,
        type: DataTypes.STRING
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: ({dropTable}: QueryInterface) => {
    return dropTable('example');
  }
};
