import Joi from 'joi';

export const createOrderSchema = Joi.object({
  restaurantId: Joi.number().required().positive(),
  deliveryAddress: Joi.string().required().min(5).max(200),
  paymentMethod: Joi.string().required().valid('cash', 'card', 'upi'),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .required()
    .valid('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'),
});
