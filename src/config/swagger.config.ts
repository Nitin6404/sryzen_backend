import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sryzan Food Ordering API',
      version: '1.0.0',
      description: 'API documentation for Sryzan food ordering system',
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerOptions = swaggerJsdoc(options);
