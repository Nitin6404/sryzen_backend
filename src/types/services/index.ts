import { IUser, IRestaurant, IMenuItem, ICart, IOrder } from '../models';
import { PaginatedResponse } from '../response';

export interface IAuthService {
  register(userData: Partial<IUser>): Promise<IUser>;
  login(email: string, password: string): Promise<{ user: IUser; token: string }>;
}

export interface IRestaurantService {
  create(data: Partial<IRestaurant>): Promise<IRestaurant>;
  findAll(query: any): Promise<PaginatedResponse<IRestaurant>>;
  findById(id: number): Promise<IRestaurant | null>;
  update(id: number, data: Partial<IRestaurant>): Promise<IRestaurant>;
  delete(id: number): Promise<boolean>;
}

export interface IMenuItemService {
  create(data: Partial<IMenuItem>): Promise<IMenuItem>;
  findAll(query: any): Promise<PaginatedResponse<IMenuItem>>;
  findById(id: number): Promise<IMenuItem | null>;
  update(id: number, data: Partial<IMenuItem>): Promise<IMenuItem>;
  delete(id: number): Promise<boolean>;
}

export interface ICartService {
  addItem(userId: number, menuItemId: number, quantity: number): Promise<ICart>;
  updateItem(userId: number, cartId: number, quantity: number): Promise<ICart>;
  removeItem(userId: number, cartId: number): Promise<boolean>;
  getCart(userId: number): Promise<ICart[]>;
  clearCart(userId: number): Promise<boolean>;
}

export interface IOrderService {
  create(userId: number, data: Partial<IOrder>): Promise<IOrder>;
  findAll(query: any): Promise<PaginatedResponse<IOrder>>;
  findById(id: number): Promise<IOrder | null>;
  updateStatus(id: number, status: IOrder['status']): Promise<IOrder>;
  getUserOrders(userId: number, query: any): Promise<PaginatedResponse<IOrder>>;
}