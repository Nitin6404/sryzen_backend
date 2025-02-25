import Joi from 'joi';

export const createRestaurantSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  address: Joi.string().required().min(5).max(200),
  phone: Joi.string().required().pattern(/^\+?[\d\s-]+$/),
  email: Joi.string().required().email(),
});

export const updateRestaurantSchema = createRestaurantSchema.fork(['name', 'address', 'phone', 'email'], (schema) => schema.optional());