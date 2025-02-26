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
      await Promise.all(
        cartItems.map(item => 
          item.update({ orderId: order.id })
        )
      );

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
          required: true
        },
        { 
          model: Cart,
          as: 'CartItems',
          include: [{ 
            model: MenuItem,
            attributes: ['name', 'price'],
            required: true
          }]
        }
      ]
    });
  
    if (!order || !order.Restaurant || !order.CartItems) {
      throw new AppError(404, 'Order or related data not found');
    }
  
    const doc = new PDFDocument();
    const invoicePath = path.join(__dirname, `../../invoices/invoice-${orderId}.pdf`);
  
    // Ensure invoices directory exists
    if (!fs.existsSync(path.dirname(invoicePath))) {
      fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
    }
  
    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);
  
    // Header
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();
  
    // Restaurant Details
    doc.fontSize(14).text('Restaurant Details:', { underline: true });
    doc.fontSize(12)
      .text(`Name: ${order.Restaurant.name}`)
      .text(`Address: ${order.Restaurant.address}`)
      .text(`Phone: ${order.Restaurant.phone}`);
    doc.moveDown();
  
    // Order Details
    doc.fontSize(14).text('Order Details:', { underline: true });
    doc.fontSize(12)
      .text(`Order ID: ${order.id}`)
      .text(`Date: ${order.createdAt.toLocaleString()}`)
      .text(`Delivery Address: ${order.deliveryAddress}`);
    doc.moveDown();
  
    // Ordered Items
    doc.fontSize(14).text('Ordered Items:', { underline: true });
    doc.moveDown();
  
    // Table Header
    const itemsTableTop = doc.y;
    doc.fontSize(12)
      .text('Item', 50, itemsTableTop)
      .text('Quantity', 300, itemsTableTop)
      .text('Price', 400, itemsTableTop)
      .text('Total', 500, itemsTableTop);
  
    doc.moveDown();
    let currentY = doc.y;
  
    // Table Content
    // Update the table content section to handle price values correctly
    order.CartItems.forEach((item) => {
      if (item.MenuItem) {
        const itemPrice = Number(item.MenuItem.price);
        const totalPrice = itemPrice * item.quantity;
        
        doc.fontSize(12)
          .text(item.MenuItem.name || 'Unknown Item', 50, currentY)
          .text(item.quantity.toString(), 300, currentY)
          .text(`$${itemPrice.toFixed(2)}`, 400, currentY)
          .text(`$${totalPrice.toFixed(2)}`, 500, currentY);
        currentY += 20;
      }
    });
  
    doc.moveDown();
    doc.moveDown();
  
    // Total and Payment Details
    const subtotal = Number(order.totalAmount);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    doc.fontSize(12)
      .text(`Subtotal: $${subtotal.toFixed(2)}`)
      .text(`Tax (10%): $${tax.toFixed(2)}`)
      .text(`Total Amount: $${total.toFixed(2)}`, { underline: true })
      .text(`Payment Method: ${order.paymentMethod}`)
      .text(`Payment Status: ${order.paymentStatus}`);
  
    // Footer
    doc.fontSize(10)
      .text('Thank you for your order!', { align: 'center' })
      .text('For any queries, please contact customer support.', { align: 'center' });
  
    doc.end();
  
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(invoicePath));
      writeStream.on('error', reject);
    });
  }
}

export default new OrderService();