import { Router } from 'express';
import { RequestHandler } from 'express';
import cartController from '../controllers/cart.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - userId
 *         - menuItemId
 *         - quantity
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         userId:
 *           type: integer
 *           description: ID of the user who owns this cart item
 *         menuItemId:
 *           type: integer
 *           description: ID of the menu item
 *         quantity:
 *           type: integer
 *           description: Quantity of the menu item
 *         price:
 *           type: number
 *           format: float
 *           description: Total price for this cart item
 *         orderId:
 *           type: integer
 *           nullable: true
 *           description: ID of the order if item is part of an order
 *         MenuItem:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             price:
 *               type: number
 */

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management endpoints
 */

/**
 * @swagger
 * /api/cart/{userId}/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuItemId
 *               - quantity
 *             properties:
 *               menuItemId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Menu item not found
 */
const addToCart: RequestHandler = async (req, res, next) => {
  await cartController.addToCart(req, res, next);
};

/**
 * @swagger
 * /api/cart/{userId}:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User's cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 */
const getUserCart: RequestHandler = async (req, res, next) => {
  await cartController.getUserCart(req, res, next);
};

/**
 * @swagger
 * /api/cart/{userId}/items/{id}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       404:
 *         description: Cart item not found
 */
const updateCartItem: RequestHandler = async (req, res, next) => {
  await cartController.updateCartItem(req, res, next);
};

/**
 * @swagger
 * /api/cart/{userId}/items/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Cart item ID
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Cart item not found
 */
const removeFromCart: RequestHandler = async (req, res, next) => {
  await cartController.removeFromCart(req, res, next);
};

/**
 * @swagger
 * /api/cart/{userId}:
 *   delete:
 *     summary: Clear user's cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const clearCart: RequestHandler = async (req, res, next) => {
  await cartController.clearCart(req, res, next);
};

router.get('/:userId/items', getUserCart);
router.post('/:userId/items', validateRequest(addToCartSchema), addToCart);
router.put('/items/:id', validateRequest(updateCartItemSchema), updateCartItem);
router.delete('/:userId/items/:id', removeFromCart);
router.delete('/', clearCart);

export default router;
