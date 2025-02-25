import { Router } from 'express';
import { RequestHandler } from 'express';
import cartController from '../controllers/cart.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

const router = Router();

const addToCart: RequestHandler = async (req, res, next) => {
  await cartController.addToCart(req, res, next);
};

const getUserCart: RequestHandler = async (req, res, next) => {
  await cartController.getUserCart(req, res, next);
};

const updateCartItem: RequestHandler = async (req, res, next) => {
  await cartController.updateCartItem(req, res, next);
};

const removeFromCart: RequestHandler = async (req, res, next) => {
  await cartController.removeFromCart(req, res, next);
};

const clearCart: RequestHandler = async (req, res, next) => {
  await cartController.clearCart(req, res, next);
};

router.post('/:userId/items', validateRequest(addToCartSchema), addToCart);
router.get('/:userId', getUserCart);
router.put('/:userId/items/:id', validateRequest(updateCartItemSchema), updateCartItem);
router.delete('/:userId/items/:id', removeFromCart);
router.delete('/:userId', clearCart);

export default router;