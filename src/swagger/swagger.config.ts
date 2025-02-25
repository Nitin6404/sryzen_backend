export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sryzan Food Ordering API',
      version: '1.0.0',
      description: 'API documentation for Sryzan food ordering system',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Restaurant: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            address: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
          },
        },
        MenuItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            restaurantId: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            restaurantId: { type: 'integer' },
            totalAmount: { type: 'number' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'] },
            deliveryAddress: { type: 'string' },
            paymentStatus: { type: 'string', enum: ['pending', 'completed', 'failed'] },
            paymentMethod: { type: 'string' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            menuItemId: { type: 'integer' },
            quantity: { type: 'integer' },
            price: { type: 'number' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};