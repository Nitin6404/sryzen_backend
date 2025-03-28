import { Router } from 'express';
import adminController from '../controllers/admin.controller';
import { isAdmin } from '../middlewares/admin.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
  updateUserSchema,
  updateRestaurantSchema,
  createRestaurantSchema,
  updateOrderSchema,
  orderAnalyticsSchema,
  paginationSchema,
} from '../validators/admin.validator';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and dashboard endpoints
 */

// Apply authentication to all admin routes
router.use(authenticate);
router.use(isAdmin);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 */
router.get('/stats', adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users with pagination
 *     tags: [Admin]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 */
router.get('/users', validateRequest(paginationSchema), adminController.getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   patch:
 *     summary: Update user role and verification status
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 */
router.patch('/users/:id', validateRequest(updateUserSchema), adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

/**
 * @swagger
 * /api/admin/restaurants:
 *   get:
 *     summary: Get all restaurants with pagination
 *     tags: [Admin]
 */
router.get('/restaurants', validateRequest(paginationSchema), adminController.getRestaurants);
router.post(
  '/restaurants',
  validateRequest(createRestaurantSchema),
  adminController.createRestaurant,
);
router.patch(
  '/restaurants/:id',
  validateRequest(updateRestaurantSchema),
  adminController.updateRestaurant,
);
router.delete('/restaurants/:id', adminController.deleteRestaurant);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders with pagination and filters
 *     tags: [Admin]
 */
router.get('/orders', validateRequest(paginationSchema), adminController.getOrders);
router.patch('/orders/:id', validateRequest(updateOrderSchema), adminController.updateOrder);
router.delete('/orders/:id', adminController.deleteOrder);

/**
 * @swagger
 * /api/admin/analytics/orders:
 *   get:
 *     summary: Get order analytics with date range
 *     tags: [Admin]
 */
router.get(
  '/analytics/orders',
  validateRequest(orderAnalyticsSchema),
  adminController.getOrderAnalytics,
);

export default router;
