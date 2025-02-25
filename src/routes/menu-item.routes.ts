import { Router } from 'express';
import { RequestHandler } from 'express';
import menuItemController from '../controllers/menu-item.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createMenuItemSchema, updateMenuItemSchema } from '../validators/menu-item.validator';

const router = Router();

const createMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.create(req, res, next);
};

const getAllMenuItems: RequestHandler = async (req, res, next) => {
  await menuItemController.findAll(req, res, next);
};

const getMenuItemById: RequestHandler = async (req, res, next) => {
  await menuItemController.findById(req, res, next);
};

const updateMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.update(req, res, next);
};

const deleteMenuItem: RequestHandler = async (req, res, next) => {
  await menuItemController.delete(req, res, next);
};

router.post('/', validateRequest(createMenuItemSchema), createMenuItem);
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.put('/:id', validateRequest(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', deleteMenuItem);

export default router;