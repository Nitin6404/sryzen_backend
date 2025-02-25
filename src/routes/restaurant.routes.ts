import { Router } from 'express';
import { RequestHandler } from 'express';
import restaurantController from '../controllers/restaurant.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createRestaurantSchema, updateRestaurantSchema } from '../validators/restaurant.validator';

const router = Router();

const createRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.create(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getAllRestaurants: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.findAll(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getRestaurantById: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.findById(req, res, next);
  } catch (error) {
    next(error);
  }
};

const updateRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.update(req, res, next);
  } catch (error) {
    next(error);
  }
};

const deleteRestaurant: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    await restaurantController.delete(req, res, next);
  } catch (error) {
    next(error);
  }
};

router.post('/', validateRequest(createRestaurantSchema), createRestaurant);
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.put('/:id', validateRequest(updateRestaurantSchema), updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router;