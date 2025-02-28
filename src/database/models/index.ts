import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import initRestaurant from './restaurant.model';
import initMenuItem from './menu.items.model';
import initCart from './cart.model';
import initOrder from './order.model';
import initUser from './user.model';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Initialize models
const Restaurant = initRestaurant(sequelize);
const MenuItem = initMenuItem(sequelize);
const Cart = initCart(sequelize);
const Order = initOrder(sequelize);
const User = initUser(sequelize);

// Define associations
MenuItem.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(MenuItem, { foreignKey: 'restaurantId' });

Cart.belongsTo(MenuItem, { foreignKey: 'menuItemId' });
MenuItem.hasMany(Cart, { foreignKey: 'menuItemId' });

Order.belongsTo(Restaurant, { foreignKey: 'restaurantId' });
Restaurant.hasMany(Order, { foreignKey: 'restaurantId' });

Order.hasMany(Cart, { foreignKey: 'orderId', as: 'CartItems' });
Cart.belongsTo(Order, { foreignKey: 'orderId' });

// Add User associations
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Order.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Order, { foreignKey: 'userId' });

// Export updated db object
const db = {
  sequelize,
  Sequelize,
  User,
  Restaurant,
  MenuItem,
  Cart,
  Order
};

export default db;