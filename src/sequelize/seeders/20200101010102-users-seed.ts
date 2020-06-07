import { QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.bulkInsert('users', [
      {
        id: 1,
        email: 'admin@example.com',
        full_name: 'Admin User',
      },
      {
        id: 2,
        email: 'user@example.com',
        full_name: 'Plain User',
      },
    ]);
  },
  down: ({bulkDelete}: QueryInterface) => {
    return bulkDelete('users', {}, {});
  }
};
