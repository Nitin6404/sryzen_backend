import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import initRestaurant from './restaurant.model';
import initMenuItem from './menu.items.model';
import initCart from './cart.model';
import initOrder from './order.model';

dotenv.config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'sryzan_db',
  dialect: 'postgres' as const,
  logging: false
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging
  }
);

// Initialize models
const Restaurant = initRestaurant(sequelize);
const MenuItem = initMenuItem(sequelize);
const Cart = initCart(sequelize);
const Order = initOrder(sequelize);

// Define associations
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId' });

Cart.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(Cart, { foreignKey: 'menuItemId' });

Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });

Order.hasMany(Cart, { foreignKey: 'orderId', as: 'CartItems' });
Cart.belongsTo(Order, { foreignKey: 'orderId' });

const db = {
  sequelize,
  Sequelize,
  Restaurant,
  MenuItem,
  Cart,
  Order
};

export default db;