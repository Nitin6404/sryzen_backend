import Joi from 'joi';

// Dashboarrd stats validation schema
// export const dashboardStatsSchema = Joi.object({

// })

// Pagination and sorting validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  search: Joi.string().allow(''),
  sortBy: Joi.string(),
  order: Joi.string().valid('ASC', 'DESC'),
});

// User management validation schemas
export const updateUserSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required(),
  isVerified: Joi.boolean().required(),
}).min(1);

// Restaurant management validation schemas
export const createRestaurantSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().optional().max(500),
  address: Joi.string().required().min(5).max(200),
  isActive: Joi.boolean().default(true),
  email: Joi.string().email().required(),
  phone: Joi.string().required().length(10),
});

export const updateRestaurantSchema = createRestaurantSchema
  .fork(['name', 'description', 'address', 'isActive'], (schema) => schema.optional())
  .min(1);

// Order management validation schemas
export const updateOrderSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')
    .required(),
  note: Joi.string().optional().max(500),
});

// Menu item management validation schemas
export const createMenuItemSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().optional().max(500),
  price: Joi.number().required().min(0),
  category: Joi.string().required(),
  isAvailable: Joi.boolean().default(true),
  restaurantId: Joi.number().required().integer().min(1),
  image: Joi.string().optional().uri(),
});

export const updateMenuItemSchema = createMenuItemSchema
  .fork(['name', 'description', 'price', 'category', 'isAvailable', 'image'], (schema) =>
    schema.optional(),
  )
  .min(1);

// Analytics validation schema
export const orderAnalyticsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
});
