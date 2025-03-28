import { User } from '../../database/models/user.model';
import { Restaurant } from '../../database/models/restaurant.model';
import { Order } from '../../database/models/order.model';
import { AppError } from '../middleware/error.middleware';
import { Op, Sequelize } from 'sequelize';

interface PaginationOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
}

interface DashboardStats {
  totalUsers: number;
  totalRestaurants: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  ordersByStatus: Record<string, number>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
}

export class AdminService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const [users, restaurants, orders] = await Promise.all([
        User.count(),
        Restaurant.count(),
        Order.findAll({
          include: [
            { model: User, attributes: ['id', 'name', 'email'] },
            { model: Restaurant, attributes: ['id', 'name'] },
          ],
          order: [['createdAt', 'DESC']],
        }),
      ]);

      const recentOrders = orders.slice(0, 5);
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

      const ordersByStatus = orders.reduce((acc: Record<string, number>, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      const dailyOrders = await Order.findAll({
        where: {
          createdAt: { [Op.gte]: last7Days },
        },
        attributes: ['createdAt', 'totalAmount'],
      });

      const dailyRevenue = dailyOrders.reduce((acc: Record<string, number>, order) => {
        const date = order.createdAt.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + Number(order.totalAmount || 0);
        return acc;
      }, {});

      const formattedDailyRevenue = Object.entries(dailyRevenue)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        totalUsers: users,
        totalRestaurants: restaurants,
        totalOrders,
        totalRevenue,
        recentOrders,
        ordersByStatus,
        dailyRevenue: formattedDailyRevenue,
      };
    } catch (error) {
      throw new AppError(500, 'Error fetching dashboard statistics');
    }
  }

  async getUsers(options: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'DESC' } = options;
      const offset = (page - 1) * limit;

      const where = search
        ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${search}%` } },
              { email: { [Op.iLike]: `%${search}%` } },
            ],
          }
        : {};

      const { rows: users, count: total } = await User.findAndCountAll({
        where,
        attributes: ['id', 'name', 'email', 'role', 'isVerified', 'createdAt'],
        order: [[sortBy, order]],
        limit,
        offset,
      });

      return {
        users,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new AppError(500, 'Error fetching users');
    }
  }

  async deleteUser(id: number) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError(404, 'User not found');
      }
      await user.destroy();
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Error deleting user');
    }
  }

  async updateUser(id: number, updates: Partial<User>) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new AppError(404, 'User not found');
      }

      delete updates.password;
      delete updates.email;

      await user.update(updates);
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Error updating user');
    }
  }

  async getRestaurants(options: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 10, search = '', sortBy = 'createdAt', order = 'DESC' } = options;
      const offset = (page - 1) * limit;

      const where = search
        ? {
            name: { [Op.iLike]: `%${search}%` },
          }
        : {};

      const { rows: restaurants, count: total } = await Restaurant.findAndCountAll({
        where,
        order: [[sortBy, order]],
        limit,
        offset,
      });

      return {
        restaurants,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new AppError(500, 'Error fetching restaurants');
    }
  }

  async createRestaurant(data: Partial<Restaurant>) {
    try {
      return await Restaurant.create(data);
    } catch (error) {
      throw new AppError(400, 'Error creating restaurant');
    }
  }

  async updateRestaurant(id: number, updates: Partial<Restaurant>) {
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
      }

      await restaurant.update(updates);
      return restaurant;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Error updating restaurant');
    }
  }

  async deleteRestaurant(id: number) {
    try {
      const restaurant = await Restaurant.findByPk(id);
      if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
      }
      await restaurant.destroy();
    } catch (error) {
      throw new AppError(500, 'Error deleting restaurant');
    }
  }

  async getOrders(options: PaginationOptions & { status?: string } = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = '',
        sortBy = 'createdAt',
        order = 'DESC',
        status,
      } = options;
      const offset = (page - 1) * limit;

      const where: any = {};
      if (status) {
        where.status = status;
      }
      if (search) {
        where[Op.or] = [
          { '$User.name$': { [Op.iLike]: `%${search}%` } },
          { '$Restaurant.name$': { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { rows: orders, count: total } = await Order.findAndCountAll({
        where,
        include: [
          { model: User, attributes: ['id', 'name', 'email'] },
          { model: Restaurant, attributes: ['id', 'name'] },
        ],
        order: [[sortBy, order]],
        limit,
        offset,
      });

      return {
        orders,
        pagination: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new AppError(500, 'Error fetching orders');
    }
  }

  async updateOrder(id: number, updates: { status: string; note?: string }) {
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      await order.update(updates);
      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Error updating order');
    }
  }

  async deleteOrder(id: number) {
    try {
      const order = await Order.findByPk(id);
      if (!order) {
        throw new AppError(404, 'Order not found');
      }
      await order.destroy();
    } catch (error) {
      throw new AppError(500, 'Error deleting order');
    }
  }

  async getOrderAnalytics(options: { startDate?: Date; endDate?: Date } = {}) {
    try {
      const { startDate, endDate } = options;
      const where: any = {};
      if (startDate) {
        where.createdAt = { [Op.gte]: startDate };
      }
      if (endDate) {
        where.createdAt = { ...where.createdAt, [Op.lte]: endDate };
      }
      const orders = await Order.findAll({
        where,
        attributes: ['status', [Sequelize.fn('COUNT', Sequelize.col('status')), 'count']],
        group: ['status'],
      });
      const orderCounts = orders.reduce((acc: Record<string, number>, order) => {
        acc[order.status] = order.getDataValue('count');
        return acc;
      }, {});
      return orderCounts;
    } catch (error) {
      throw new AppError(500, 'Error fetching order analytics');
    }
  }
}

export default new AdminService();
