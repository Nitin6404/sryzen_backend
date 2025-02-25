import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger/swagger.config';
import restaurantRoutes from './routes/restaurant.routes';
import menuItemRoutes from './routes/menu-item.routes';
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes';
import { errorHandler } from './middleware/error.middleware';
import { initDatabase } from './config/db.init';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await initDatabase();
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