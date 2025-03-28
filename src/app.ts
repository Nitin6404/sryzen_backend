import http from 'http';
import dotenv from 'dotenv';
import serverConfig from './config/express.config';
import db from './database/models';
import logger from './utils/logger';
import { seedAdmin } from './database/seeders/admin.seeder';

dotenv.config();

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Initialize Express app
    const app = await serverConfig();

    // Initialize database with retries
    let retries = 5;
    while (retries) {
      try {
        // Force sync in development to update table structure
        const force = process.env.NODE_ENV === 'development';
        await db.sequelize.sync({ force });
        logger.info(`Database synchronized successfully (force: ${force})`);
        break;
      } catch (err) {
        logger.error('Database sync failed:', err);
        retries -= 1;
        if (retries === 0) throw err;
        logger.info(`Retrying database sync... (${retries} attempts remaining)`);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    // Seed admin user
    await seedAdmin();

    // Create HTTP server
    const server = http.createServer(app);

    // Start server
    server.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
})();
