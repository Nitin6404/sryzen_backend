import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';

export class OrderController {
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.createOrder(Number(req.params.userId), req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orders = await orderService.getUserOrders(Number(req.params.userId));
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.getOrderById(Number(req.params.id));
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await orderService.updateOrderStatus(Number(req.params.orderId), req.body.status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async downloadInvoice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoicePath = await orderService.generateInvoice(Number(req.params.id));
      res.download(invoicePath);
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
