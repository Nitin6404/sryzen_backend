import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from '../api/middleware/error.middleware';
import { requestLogger } from '../api/middleware/logging.middleware';
import * as fs from 'fs/promises';
import * as path from 'path';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './swagger.config';
import logger from '../utils/logger';

const server = async () => {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
  );
  app.use(morgan('dev'));
  app.use(requestLogger);

  // Swagger docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions));

  // Dynamic route loading
  const loadRouters = async (dir: string) => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await loadRouters(fullPath);
      } else if (
        entry.isFile() &&
        (entry.name.endsWith('.routes.ts') || entry.name.endsWith('.routes.js'))
      ) {
        const router = require(fullPath);
        const routePath = `/api/${entry.name.replace(/\.routes\.(ts|js)$/, '')}`;
        logger.info(`Loading router for path: ${routePath}`);
        if (router.default) {
          app.use(routePath, router.default);
        } else {
          app.use(routePath, router);
        }
      }
    }
  };

  await loadRouters(path.join(__dirname, '../api/routes'));

  // Error handling
  app.use(errorHandler);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      status: 'error',
      message: 'Route not found',
    });
  });

  return app;
};

export default server;
