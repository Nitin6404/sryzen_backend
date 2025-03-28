import { Request, Response, NextFunction } from 'express';
import adminService from '../services/admin.service';
import { ApiError } from '../utils/ApiError';

interface PaginatedRequest extends Request {
  query: {
    page?: string;
    limit?: string;
    search?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
    status?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  };
}

class AdminController {
  public async getDashboardStats(
    _req: PaginatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // const { startDate, endDate } = req.query;
      const stats = await adminService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error fetching dashboard stats'));
    }
  }

  public async getUsers(req: PaginatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, sortBy, order } = req.query;
      const result = await adminService.getUsers({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search,
        sortBy,
        order,
      });

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error fetching users'));
    }
  }

  public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = await adminService.updateUser(parseInt(id), req.body);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User not found') {
        next(new ApiError(404, 'User not found'));
      } else {
        next(new ApiError(500, 'Error updating user'));
      }
    }
  }

  public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await adminService.deleteUser(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'User not found') {
        next(new ApiError(404, 'User not found'));
      } else {
        next(new ApiError(500, 'Error deleting user'));
      }
    }
  }

  public async getRestaurants(
    req: PaginatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { page, limit, search, sortBy, order } = req.query;
      const result = await adminService.getRestaurants({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search,
        sortBy,
        order,
      });

      res.status(200).json({
        success: true,
        data: result.restaurants,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error fetching restaurants'));
    }
  }

  public async createRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await adminService.createRestaurant(req.body);
      res.status(201).json({
        success: true,
        data: restaurant,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error creating restaurant'));
    }
  }

  public async updateRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const restaurant = await adminService.updateRestaurant(parseInt(id), req.body);
      res.status(200).json({
        success: true,
        data: restaurant,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Restaurant not found') {
        next(new ApiError(404, 'Restaurant not found'));
      } else {
        next(new ApiError(500, 'Error updating restaurant'));
      }
    }
  }

  public async deleteRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await adminService.deleteRestaurant(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Restaurant deleted successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Restaurant not found') {
        next(new ApiError(404, 'Restaurant not found'));
      } else {
        next(new ApiError(500, 'Error deleting restaurant'));
      }
    }
  }

  public async getOrders(req: PaginatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, sortBy, order, status } = req.query;
      const result = await adminService.getOrders({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        search,
        sortBy,
        order,
        status,
      });

      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error fetching orders'));
    }
  }

  public async updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const order = await adminService.updateOrder(parseInt(id), req.body);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Order not found') {
        next(new ApiError(404, 'Order not found'));
      } else {
        next(new ApiError(500, 'Error updating order'));
      }
    }
  }

  public async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await adminService.deleteOrder(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Order not found') {
        next(new ApiError(404, 'Order not found'));
      } else {
        next(new ApiError(500, 'Error deleting order'));
      }
    }
  }

  public async getOrderAnalytics(
    req: PaginatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await adminService.getOrderAnalytics({
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      });
      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: unknown) {
      next(new ApiError(500, 'Error fetching order analytics'));
    }
  }
}

export default new AdminController();
