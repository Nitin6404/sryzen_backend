import Joi from 'joi';

export const createMenuItemSchema = Joi.object({
  restaurantId: Joi.number().required().positive(),
  name: Joi.string().required().min(2).max(100),
  description: Joi.string().optional().max(500),
  price: Joi.number().required().positive().precision(2),
  category: Joi.string().required().min(2).max(50),
});

export const updateMenuItemSchema = createMenuItemSchema.fork(
  ['restaurantId', 'name', 'description', 'price', 'category'],
  (schema) => schema.optional()
);