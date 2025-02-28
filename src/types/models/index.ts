import { Model } from 'sequelize';

// User Types
export interface IUser {
  id: number;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserModel extends Model<IUser>, IUser {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Restaurant Types
export interface IRestaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRestaurantModel extends Model<IRestaurant>, IRestaurant {}

// MenuItem Types
export interface IMenuItem {
  id: number;
  restaurantId: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMenuItemModel extends Model<IMenuItem>, IMenuItem {}

// Cart Types
export interface ICart {
  id: number;
  userId: number;
  menuItemId: number;
  quantity: number;
  orderId?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartModel extends Model<ICart>, ICart {}

// Order Types
export interface IOrder {
  id: number;
  userId: number;
  restaurantId: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderModel extends Model<IOrder>, IOrder {}