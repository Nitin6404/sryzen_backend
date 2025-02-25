import { Request, Response, NextFunction } from 'express';
import menuItemService from '../services/menu-item.service';

export class MenuItemController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menuItem = await menuItemService.create(req.body);
      res.status(201).json(menuItem);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { restaurantId } = req.query;
      const menuItems = await menuItemService.findAll(restaurantId ? Number(restaurantId) : undefined);
      res.json(menuItems);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menuItem = await menuItemService.findById(Number(req.params.id));
      res.json(menuItem);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const menuItem = await menuItemService.update(Number(req.params.id), req.body);
      res.json(menuItem);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await menuItemService.delete(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export default new MenuItemController();