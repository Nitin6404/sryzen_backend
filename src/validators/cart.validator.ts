import Joi from 'joi';

export const addToCartSchema = Joi.object({
  userId: Joi.number().required().positive(),
  menuItemId: Joi.number().required().positive(),
  quantity: Joi.number().required().positive(),
});

export const updateCartItemSchema = Joi.object({
  quantity: Joi.number().required().positive(),
});