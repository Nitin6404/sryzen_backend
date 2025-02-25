import { Order } from '../models/order.model';
import { Cart } from '../models/cart.model';
import { MenuItem } from '../models/menu.items.model';
import { Restaurant } from '../models/restaurant.model';
import { AppError } from '../middleware/error.middleware';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export class OrderService {
  async createOrder(userId: number, data: any) {
    try {
      // First, check if restaurant exists
      const restaurant = await Restaurant.findByPk(data.restaurantId);
      if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
      }

      // Get cart items for the user
      const cartItems = await Cart.findAll({
        where: { userId },
        include: [{ model: MenuItem }],
      });

      if (!cartItems.length) {
        throw new AppError(400, 'Cart is empty');
      }

      // Calculate total amount from cart items
      const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

      // Create order
      const order = await Order.create({
        userId,
        restaurantId: data.restaurantId,
        totalAmount,
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Clear cart after order creation
      await Cart.destroy({ where: { userId } });

      return order;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(400, 'Error creating order');
    }
  }

  async getUserOrders(userId: number) {
    return await Order.findAll({
      where: { userId },
      include: [{ model: Restaurant, attributes: ['name'] }],
    });
  }

  async getOrderById(id: number) {
    const order = await Order.findByPk(id, {
      include: [{ model: Restaurant, attributes: ['name'] }],
    });
    if (!order) {
      throw new AppError(404, 'Order not found');
    }
    return order;
  }

  async updateOrderStatus(id: number, status: string) {
    const order = await this.getOrderById(id);
    return await order.update({ status });
  }

  async generateInvoice(orderId: number): Promise<string> {
    const order = await this.getOrderById(orderId);
    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, `../../invoices/invoice-${orderId}.pdf`);

    // Ensure invoices directory exists
    if (!fs.existsSync(path.dirname(invoicePath))) {
      fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
    }

    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // Add invoice content
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order.id}`);
    doc.text(`Date: ${order.createdAt}`);
    doc.text(`Delivery Address: ${order.deliveryAddress}`);
    doc.text(`Total Amount: $${order.totalAmount}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.text(`Payment Method: ${order.paymentMethod}`);

    doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(invoicePath));
      writeStream.on('error', reject);
    });
  }
}

export default new OrderService();