import Joi from 'joi';

export const createRestaurantSchema = Joi.object({
  name: Joi.string().required().min(3).max(100).trim(),
  address: Joi.string().required().min(5).max(200).trim(),
  phone: Joi.string()
    .required()
    .pattern(/^\+?[\d\s-]+$/)
    .min(10)
    .max(15),
  email: Joi.string().required().email().lowercase().trim(),
});

export const updateRestaurantSchema = createRestaurantSchema.fork(
  ['name', 'address', 'phone', 'email'],
  (schema) => schema.optional(),
);
