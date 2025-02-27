import { Router } from 'express';
import { RequestHandler } from 'express';
import orderController from '../controllers/order.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - restaurantId
 *         - deliveryAddress
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         userId:
 *           type: integer
 *           description: ID of the user who placed the order
 *         restaurantId:
 *           type: integer
 *           description: ID of the restaurant
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *           description: Current order status
 *         deliveryAddress:
 *           type: string
 *           description: Delivery address
 *         paymentStatus:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: Payment status
 *         paymentMethod:
 *           type: string
 *           enum: [cash, card, upi]
 *           description: Payment method
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         Restaurant:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /api/orders/{userId}:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
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
 *               - restaurantId
 *               - deliveryAddress
 *               - paymentMethod
 *             properties:
 *               restaurantId:
 *                 type: integer
 *               deliveryAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, card, upi]
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input or empty cart
 *       404:
 *         description: Restaurant not found
 */
const createOrder: RequestHandler = async (req, res, next) => {
  await orderController.createOrder(req, res, next);
};

/**
 * @swagger
 * /api/orders/{userId}:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of user's orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
const getUserOrders: RequestHandler = async (req, res, next) => {
  await orderController.getUserOrders(req, res, next);
};

/**
 * @swagger
 * /api/orders/detail/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
const getOrderById: RequestHandler = async (req, res, next) => {
  await orderController.getOrderById(req, res, next);
};

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, preparing, ready, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 */
const updateOrderStatus: RequestHandler = async (req, res, next) => {
  await orderController.updateOrderStatus(req, res, next);
};

/**
 * @swagger
 * /api/orders/{id}/invoice:
 *   get:
 *     summary: Download order invoice
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Invoice PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Order not found
 */
const downloadInvoice: RequestHandler = async (req, res, next) => {
  await orderController.downloadInvoice(req, res, next);
};

router.post('/:userId', validateRequest(createOrderSchema), createOrder);
router.get('/:userId', getUserOrders);
router.get('/detail/:id', getOrderById);
router.put('/:id/status', validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.get('/:id/invoice', downloadInvoice);

export default router;