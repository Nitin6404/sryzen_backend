import { Request } from 'express';
import { IUser } from '../models';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface FilterQuery {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RestaurantQuery extends PaginationQuery, FilterQuery {}

export interface MenuItemQuery extends PaginationQuery, FilterQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderQuery extends PaginationQuery {
  status?: string;
  startDate?: string;
  endDate?: string;
}
