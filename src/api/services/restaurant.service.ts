import { Restaurant } from '../../database/models/restaurant.model';
import { AppError } from '../middleware/error.middleware';

export class RestaurantService {
  async create(data: any) {
    try {
      return await Restaurant.create(data);
    } catch (error) {
      throw new AppError(400, 'Error creating restaurant');
    }
  }

  async findAll() {
    return await Restaurant.findAll();
  }

  async findById(id: number) {
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      throw new AppError(404, 'Restaurant not found');
    }
    return restaurant;
  }

  async update(id: number, data: any) {
    const restaurant = await this.findById(id);
    return await restaurant.update(data);
  }

  async delete(id: number) {
    const restaurant = await this.findById(id);
    await restaurant.destroy();
    return { message: 'Restaurant deleted successfully' };
  }
}

export default new RestaurantService();