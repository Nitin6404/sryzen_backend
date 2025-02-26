'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('carts', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'orders',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('carts', 'orderId');
  }
};