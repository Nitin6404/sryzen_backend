import { Request, Response, NextFunction } from 'express';
import restaurantService from '../services/restaurant.service';

export class RestaurantController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.create(req.body);
      res.status(201).json(restaurant);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurants = await restaurantService.findAll();
      res.json(restaurants);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.findById(Number(req.params.id));
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurant = await restaurantService.update(Number(req.params.id), req.body);
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await restaurantService.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new RestaurantController();