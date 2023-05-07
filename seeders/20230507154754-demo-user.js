'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [{
      id: 4,
      username: "miftakhul",
      password: "cantik123",
      role: "user",
      createdAt: "2023-05-04T14:27:47.527Z",
      updatedAt: "2023-05-04T14:27:47.527Z",
    }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};