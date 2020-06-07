import { QueryInterface } from "sequelize";

const fs = require('fs');

module.exports = {
  up: ({bulkInsert}: QueryInterface) => {
    const migrations = fs.readFileSync(`${__dirname}/../init.json`).toString();
    return bulkInsert('SequelizeMeta', JSON.parse(migrations).map((it: string) => ({name: it})), {});
  },

  down: ({bulkDelete}: QueryInterface) => {
    return bulkDelete('SequelizeMeta', {}, {});
  }
};
