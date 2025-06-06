import { SwaggerGenerator } from '../utils/swagger-generator';
import { registerSchema, loginSchema } from '../api/validators/auth.validator';
import { addToCartSchema, updateCartItemSchema } from '../api/validators/cart.validator';
import { createOrderSchema, updateOrderStatusSchema } from '../api/validators/order.validator';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
} from '../api/validators/restaurant.validator';
import { createMenuItemSchema, updateMenuItemSchema } from '../api/validators/menu-item.validator';
import { SwaggerMethod } from '../utils/swagger-generator';

// Initialize Swagger
SwaggerGenerator.initialize({
  title: 'Sryzan Food Ordering API',
  description: 'API documentation for Sryzan food ordering system',
  version: '1.0.0',
  basePath: 'http://localhost:4000',
});

// Auth Routes
SwaggerGenerator.addRoute('/api/auth/register', SwaggerMethod.POST, {
  tags: ['Authentication'],
  summary: 'Register new user',
  description: 'Create a new user account',
  requestSchema: registerSchema,
  security: false,
});

SwaggerGenerator.addRoute('/api/auth/login', SwaggerMethod.POST, {
  tags: ['Authentication'],
  summary: 'User login',
  description: 'Authenticate user and get token',
  requestSchema: loginSchema,
  security: false,
});

// Restaurant Routes
SwaggerGenerator.addRoute('/api/restaurant', SwaggerMethod.GET, {
  tags: ['Restaurant'],
  summary: 'Get all restaurant',
  description: 'Retrieve all restaurant',
});

SwaggerGenerator.addRoute('/api/restaurant/:id', SwaggerMethod.GET, {
  tags: ['Restaurant'],
  summary: 'Get restaurant by ID',
  description: 'Retrieve a specific restaurant',
});

SwaggerGenerator.addRoute('/api/restaurant', SwaggerMethod.POST, {
  tags: ['Restaurant'],
  summary: 'Create restaurant',
  description: 'Create a new restaurant (Admin only)',
  requestSchema: createRestaurantSchema,
});

SwaggerGenerator.addRoute('/api/restaurant/:id', SwaggerMethod.PUT, {
  tags: ['Restaurant'],
  summary: 'Update restaurant',
  description: 'Update an existing restaurant (Admin only)',
  requestSchema: updateRestaurantSchema,
});

SwaggerGenerator.addRoute('/api/restaurant/:id', SwaggerMethod.DELETE, {
  tags: ['Restaurant'],
  summary: 'Delete restaurant',
  description: 'Delete a restaurant (Admin only)',
});

// Menu Item Routes
SwaggerGenerator.addRoute('/api/menu-item', SwaggerMethod.GET, {
  tags: ['Menu Items'],
  summary: 'Get all menu items',
  description: 'Retrieve all menu items',
});

SwaggerGenerator.addRoute('/api/menu-item/:id', SwaggerMethod.GET, {
  tags: ['Menu Items'],
  summary: 'Get menu item by ID',
  description: 'Retrieve a specific menu item',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: 'Menu item ID',
    },
  ],
});

SwaggerGenerator.addRoute('/api/menu-item', SwaggerMethod.POST, {
  tags: ['Menu Items'],
  summary: 'Create menu item',
  description: 'Create a new menu item (Admin only)',
  requestSchema: createMenuItemSchema,
});

SwaggerGenerator.addRoute('/api/menu-item/:id', SwaggerMethod.PUT, {
  tags: ['Menu Items'],
  summary: 'Update menu item',
  description: 'Update an existing menu item (Admin only)',
  requestSchema: updateMenuItemSchema,
});

SwaggerGenerator.addRoute('/api/menu-item/:id', SwaggerMethod.DELETE, {
  tags: ['Menu Items'],
  summary: 'Delete menu item',
  description: 'Delete a menu item (Admin only)',
});

// Cart Routes
SwaggerGenerator.addRoute('/api/cart/:userId/items', SwaggerMethod.GET, {
  tags: ['Cart'],
  summary: 'Get cart items',
  description: "Get all items in user's cart",
  parameters: [
    {
      name: 'userId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: "User's ID",
    },
  ],
});

SwaggerGenerator.addRoute('/api/cart/:userId/items', SwaggerMethod.POST, {
  tags: ['Cart'],
  summary: 'Add to cart',
  description: "Add an item to user's cart",
  requestSchema: addToCartSchema,
  parameters: [
    {
      name: 'userId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: "User's ID",
    },
  ],
});

SwaggerGenerator.addRoute('/api/cart/:userId/items/:itemId', SwaggerMethod.PUT, {
  tags: ['Cart'],
  summary: 'Update cart item',
  description: 'Update quantity of an item in cart',
  requestSchema: updateCartItemSchema,
});

SwaggerGenerator.addRoute('/api/cart/:userId/items/:itemId', SwaggerMethod.DELETE, {
  tags: ['Cart'],
  summary: 'Remove from cart',
  description: 'Remove an item from cart',
  parameters: [
    {
      name: 'userId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: "User's ID",
    },
    {
      name: 'itemId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: "Item's ID",
    },
  ],
});

SwaggerGenerator.addRoute('/api/cart/:userId/clear', SwaggerMethod.DELETE, {
  tags: ['Cart'],
  summary: 'Clear cart',
  description: 'Remove all items from cart',
});

// Order Routes
SwaggerGenerator.addRoute('/api/orders/:userId', SwaggerMethod.GET, {
  tags: ['Orders'],
  summary: 'Get user orders',
  description: 'Get all orders for a user',
});

SwaggerGenerator.addRoute('/api/orders/:userId/:orderId', SwaggerMethod.GET, {
  tags: ['Orders'],
  summary: 'Get order details',
  description: 'Get detailed information about a specific order',
});

SwaggerGenerator.addRoute('/api/order/:userId', SwaggerMethod.POST, {
  tags: ['Orders'],
  summary: 'Create order',
  description: 'Create a new order from cart items',
  security: true,
  requestSchema: createOrderSchema,
  parameters: [
    {
      name: 'userId',
      in: 'path',
      required: true,
      schema: {
        type: 'integer',
      },
      description: "User's ID",
    },
  ]
});

SwaggerGenerator.addRoute('/api/orders/:orderId/status', SwaggerMethod.PUT, {
  tags: ['Orders'],
  summary: 'Update order status',
  description: 'Update the status of an order (Admin only)',
  requestSchema: updateOrderStatusSchema,
});

// Export the swagger document
export const swaggerOptions = SwaggerGenerator.getDocument();
