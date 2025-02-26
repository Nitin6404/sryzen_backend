'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('restaurants', [
      {
        name: 'Delhies Foddies',
        address: 'Okhla Vihar, New Delhi',
        phone: '+1234567890',
        email: 'info@delhiesfoodies.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pizza Hut',
        address: 'Connaught Place, London',
        phone: '+1234567890',
        email: 'info@pizzahut.com',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('restaurants', null, {});
  }
};
