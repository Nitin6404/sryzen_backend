import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';
import restaurantRoutes from './api/routes/restaurant.routes';
import menuItemRoutes from './api/routes/menu-item.routes';
import cartRoutes from './api/routes/cart.routes';
import orderRoutes from './api/routes/order.routes';
import { errorHandler } from './api/middleware/error.middleware';
import authRoutes from './api/routes/auth.routes';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import db from './database/models';

dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Error Handler
app.use(errorHandler); // Use the error handler with the correct signature

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    // Initialize database with retries
    let retries = 5;
    while (retries) {
      try {
        await db.sequelize.sync({ force: false });
        console.log('Database synchronized successfully');
        break;
      } catch (err) {
        console.error('Database sync failed:', err);
        retries -= 1;
        if (retries === 0) throw err;
        console.log(`Retrying database sync... (${retries} attempts remaining)`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;