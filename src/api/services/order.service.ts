import { Order } from '../../database/models/order.model';
import { Cart } from '../../database/models/cart.model';
import { MenuItem } from '../../database/models/menu.items.model';
import { Restaurant } from '../../database/models/restaurant.model';
import { AppError } from '../middleware/error.middleware';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export class OrderService {
  async createOrder(userId: number, data: any) {
    try {
      const restaurant = await Restaurant.findByPk(data.restaurantId);
      if (!restaurant) {
        throw new AppError(404, 'Restaurant not found');
      }

      const cartItems = await Cart.findAll({
        where: { userId },
        include: [{ model: MenuItem }],
      });

      if (!cartItems.length) {
        throw new AppError(400, 'Cart is empty');
      }

      const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

      const order = await Order.create({
        userId,
        restaurantId: data.restaurantId,
        totalAmount,
        deliveryAddress: data.deliveryAddress,
        paymentMethod: data.paymentMethod,
        status: 'pending',
        paymentStatus: 'pending',
      });

      // Update cart items with orderId instead of deleting them
      await Promise.all(cartItems.map((item) => item.update({ orderId: order.id })));

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
  // Update the generateInvoice method
  async generateInvoice(orderId: number): Promise<string> {
    const order = await Order.findByPk(orderId, {
      include: [
        {
          model: Restaurant,
          attributes: ['name', 'address', 'phone'],
          required: true,
        },
        {
          model: Cart,
          as: 'CartItems',
          include: [
            {
              model: MenuItem,
              attributes: ['name', 'price'],
              required: true,
            },
          ],
        },
      ],
    });
  
    if (!order || !order.Restaurant || !order.CartItems) {
      throw new AppError(404, 'Order or related data not found');
    }
  
    const doc = new PDFDocument({ margin: 50 });
    const environment = process.env.NODE_ENV || 'development';
    const dirName = environment === 'production' ? '/tmp' : __dirname;
    const invoicePath = path.join(dirName, `../../invoices/invoice-${orderId}.pdf`);
  
    // Ensure invoice folder exists
    fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
  
    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // const logoPath = path.join(__dirname, '../../assets/logo-black.png');
    doc.image("https://res.cloudinary.com/doaggd1wa/image/upload/v1749073877/logo-black_iolzdd.png", {
      fit: [150, 80],
      align: 'center',
    });
  
    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
  
    // Restaurant Info
    doc.fontSize(12).text(`Restaurant: ${order.Restaurant.name}`);
    doc.text(`Address: ${order.Restaurant.address}`);
    doc.text(`Phone: ${order.Restaurant.phone}`);
    doc.moveDown();
  
    // Order Info
    doc.text(`Order ID: ${order.id}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Delivery Address: ${order.deliveryAddress}`);
    doc.moveDown();
  
    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('Item', 50).text('Qty', 300).text('Price', 400).text('Total', 500);
    doc.moveDown();
  
    // Table Rows
    doc.font('Helvetica');
    let subtotal = 0;
  
    for (const item of order.CartItems) {
      if (item.MenuItem) {
        const itemPrice = Number(item.MenuItem.price);
        const totalPrice = itemPrice * item.quantity;
        subtotal += totalPrice;
  
        doc
          .text(item.MenuItem.name, 50)
          .text(`${item.quantity}`, 300)
          .text(`$${itemPrice.toFixed(2)}`, 400)
          .text(`$${totalPrice.toFixed(2)}`, 500);
        doc.moveDown();
      }
    }
  
    // Totals
    const tax = subtotal * 0.1;
    const grandTotal = subtotal + tax;
  
    doc.moveDown();
    doc.font('Helvetica-Bold');
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, { align: 'right' });
    doc.text(`Tax (10%): $${tax.toFixed(2)}`, { align: 'right' });
    doc.text(`Total: $${grandTotal.toFixed(2)}`, { align: 'right' });
    doc.moveDown();
  
    // Payment Info
    doc.font('Helvetica');
    doc.text(`Payment Method: ${order.paymentMethod}`);
    doc.text(`Payment Status: ${order.paymentStatus}`);
    doc.moveDown();
  
    // Footer
    doc.fontSize(10).text('Thank you for your order!', { align: 'center' });
    doc.text('For support, contact us at support@example.com', { align: 'center' });
  
    doc.end();
  
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(invoicePath));
      writeStream.on('error', reject);
    });
  }
  
}

export default new OrderService();
