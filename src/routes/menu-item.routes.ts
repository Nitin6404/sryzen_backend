import { Router } from 'express';
import { RequestHandler } from 'express';
import menuItemController from '../controllers/menu-item.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu-item.validator';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - restaurantId
 *         - name
 *         - price
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         restaurantId:
 *           type: integer
 *           description: ID of the restaurant this menu item belongs to
 *         name:
 *           type: string
 *           description: Name of the menu item
 *         description:
 *           type: string
 *           description: Detailed description of the menu item
 *         price:
 *           type: number
 *           format: float
 *           description: Price of the menu item
 *         category:
 *           type: string
 *           description: Category of the menu item (e.g., Starters, Main Course)
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
 *   name: Menu Items
 *   description: Menu items management endpoints
 */

/**
 * @swagger
 * /api/menu-items:
 *   post:
 *     summary: Create a new menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       400:
 *         description: Invalid input
 */
const createMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.create(req, res, next);
};

/**
 * @swagger
 * /api/menu-items:
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu Items]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter menu items by restaurant ID
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */
const getAllMenuItems: RequestHandler = async (req, res, next) => {
  await menuItemController.findAll(req, res, next);
};

/**
 * @swagger
 * /api/menu-items/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 */
const getMenuItemById: RequestHandler = async (req, res, next) => {
  await menuItemController.findById(req, res, next);
};

/**
 * @swagger
 * /api/menu-items/{id}:
 *   put:
 *     summary: Update menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               restaurantId:
 *                 type: integer
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *       400:
 *         description: Invalid input
 */
const updateMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.update(req, res, next);
};

/**
 * @swagger
 * /api/menu-items/{id}:
 *   delete:
 *     summary: Delete menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Menu item not found
 */
const deleteMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.delete(req, res, next);
};

router.post('/', validateRequest(createMenuItemSchema), createMenuItem);
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.put('/:id', validateRequest(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;