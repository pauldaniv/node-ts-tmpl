import {QueryInterface} from "sequelize";

const fs = require("fs");
const dmp = fs.readFileSync(`${__dirname}/../../dmp/init.sql`);

module.exports = {
  up: ({sequelize}: QueryInterface) => {
    return sequelize.query(dmp.toString());
  },

  down: ({sequelize}: QueryInterface) => {
    return sequelize.query('drop schema public');
  }
};
