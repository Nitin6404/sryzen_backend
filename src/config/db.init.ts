import sequelize from './database.config';
console.log('Sequelize instance:', sequelize);
import initRestaurant from '../models/restaurant.model';
import initMenuItem from '../models/menu.items.model';
import initCart from '../models/cart.model';
import initOrder from '../models/order.model';

console.log('Initializing modelss...');

// Initialize models
const Restaurant = initRestaurant(sequelize);
const MenuItem = initMenuItem(sequelize);
const Cart = initCart(sequelize);
const Order = initOrder(sequelize);

console.log('Models initialized');

// Define associations
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId' });

Cart.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(Cart, { foreignKey: 'menuItemId' });

Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });

// Add this new association
// Update the Order-Cart association
Order.hasMany(Cart, { foreignKey: 'orderId', as: 'CartItems' });
Cart.belongsTo(Order, { foreignKey: 'orderId' });

export const initDatabase = async () => {
  try {
    console.log('Synchronizing database...');
    await sequelize.sync({ force: false });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
    throw error;
  }
};

export { Restaurant, MenuItem, Cart, Order };