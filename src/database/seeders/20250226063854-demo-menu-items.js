'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('menu_items', [
      // Pizza Palace Items
      {
        restaurantId: 11,
        name: 'Margherita Pizza',
        description: 'Classic tomato and mozzarella pizza',
        price: 12.99,
        category: 'Pizza',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: 11,
        name: 'Pepperoni Pizza',
        description: 'Pizza with pepperoni toppings',
        price: 14.99,
        category: 'Pizza',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Burger House Items
      {
        restaurantId: 12,
        name: 'Classic Burger',
        description: 'Beef patty with lettuce and tomato',
        price: 9.99,
        category: 'Burgers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: 12,
        name: 'Cheese Burger',
        description: 'Classic burger with extra cheese',
        price: 11.99,
        category: 'Burgers',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Biryani Paradise Items
      {
        restaurantId: 13,
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice cooked with tender chicken and spices',
        price: 15.99,
        category: 'Biryani',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: 13,
        name: 'Mutton Biryani',
        description: 'Traditional biryani with tender mutton pieces',
        price: 17.99,
        category: 'Biryani',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: 13,
        name: 'Veg Biryani',
        description: 'Flavorful biryani with mixed vegetables',
        price: 13.99,
        category: 'Biryani',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Asian Fusion Items
      {
        restaurantId: 14,
        name: 'Pad Thai',
        description: 'Thai style stir-fried rice noodles',
        price: 14.99,
        category: 'Noodles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        restaurantId: 14,
        name: 'Sushi Roll',
        description: 'California roll with crab and avocado',
        price: 16.99,
        category: 'Sushi',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('menu_items', null, {});
  }
};