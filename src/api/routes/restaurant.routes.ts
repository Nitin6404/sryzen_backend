import { Router } from 'express';
import { RequestHandler } from 'express';
import restaurantController from '../controllers/restaurant.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createRestaurantSchema, updateRestaurantSchema } from '../validators/restaurant.validator';
import { adminAuth } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - phone
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: Restaurant name
 *         address:
 *           type: string
 *           description: Restaurant address
 *         phone:
 *           type: string
 *           description: Contact number
 *         email:
 *           type: string
 *           format: email
 *           description: Email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant management endpoints
 */

/**
 * @swagger
 * /api/restaurant:
 *   post:
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid input
 */
const createRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.create(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/restaurant:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */
const getAllRestaurants: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.findAll(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
const getRestaurantById: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.findById(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *       400:
 *         description: Invalid input
 */
const updateRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.update(req, res, next);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Restaurant not found
 */
const deleteRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.delete(req, res, next);
  } catch (error) {
    next(error);
  }
};

// Protected routes
router.post('/', adminAuth, validateRequest(createRestaurantSchema), createRestaurant);
router.put('/:id', adminAuth, validateRequest(updateRestaurantSchema), updateRestaurant);
router.delete('/:id', adminAuth, deleteRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', validateRequest(updateRestaurantSchema), updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;
