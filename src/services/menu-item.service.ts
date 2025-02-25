import { MenuItem } from '../models/menu.items.model';
import { AppError } from '../middleware/error.middleware';

export class MenuItemService {
  async create(data: any) {
    try {
      return await MenuItem.create(data);
    } catch (error) {
      throw new AppError(400, 'Error creating menu item');
    }
  }

  async findAll(restaurantId?: number) {
    const where = restaurantId ? { restaurantId } : {};
    return await MenuItem.findAll({ where });
  }

  async findById(id: number) {
    const menuItem = await MenuItem.findByPk(id);
    if (!menuItem) {
      throw new AppError(404, 'Menu item not found');
    }
    return menuItem;
  }

  async update(id: number, data: any) {
    const menuItem = await this.findById(id);
    return await menuItem.update(data);
  }

  async delete(id: number) {
    const menuItem = await this.findById(id);
    await menuItem.destroy();
    return { message: 'Menu item deleted successfully' };
  }
}

export default new MenuItemService();