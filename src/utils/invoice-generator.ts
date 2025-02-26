import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Order } from '../models/order.model';

export class InvoiceGenerator {
  private doc: PDFKit.PDFDocument;
  private order: Order;
  private currentY: number;

  constructor(order: Order) {
    this.order = order;
    this.doc = new PDFDocument();
    this.currentY = 0;
  }

  private generateHeader() {
    this.doc.font('Helvetica-Bold')
      .fontSize(28)
      .fillColor('#FF9F1C')
      .text('INVOICE', 400, 60, { align: 'right' });

    // Restaurant info
    this.doc.font('Helvetica-Bold')
      .fontSize(20)
      .fillColor('#000')
      .text(this.order.Restaurant.name, 50, 50)
      .fontSize(12)
      .font('Helvetica')
      .text(this.order.Restaurant.address)
      .text(this.order.Restaurant.phone);
  }

  private generateCustomerInfo() {
    this.doc.moveDown(2)
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('BILL TO:')
      .moveDown(0.5)
      .font('Helvetica')
      .fontSize(12)
      .text(`Order ID: #${this.order.id}`)
      .text(`Delivery Address: ${this.order.deliveryAddress}`)
      .text(`Date: ${this.order.createdAt.toLocaleDateString()}`)
      .text(`Due Date: ${new Date(this.order.createdAt.getTime() + 3*24*60*60*1000).toLocaleDateString()}`);
  }

  private generateTable() {
    this.doc.moveDown(2);
    const tableTop = this.doc.y;
    this.doc.font('Helvetica-Bold');

    // Table headers
    this.doc.rect(50, tableTop, 500, 20).fill('#FF9F1C');
    this.doc.fillColor('#FFFFFF')
      .text('ITEM DESCRIPTION', 60, tableTop + 5)
      .text('PRICE', 280, tableTop + 5)
      .text('QTY', 350, tableTop + 5)
      .text('TOTAL', 450, tableTop + 5);

    // Table content
    let yPos = tableTop + 30;
    this.doc.fillColor('#000');

    this.order.CartItems.forEach((item) => {
      if (item.MenuItem) {
        this.doc.font('Helvetica')
          .text(item.MenuItem.name, 60, yPos)
          .text(`$${Number(item.MenuItem.price).toFixed(2)}`, 280, yPos)
          .text(item.quantity.toString(), 350, yPos)
          .text(`$${(Number(item.MenuItem.price) * item.quantity).toFixed(2)}`, 450, yPos);
        yPos += 25;
      }
    });

    this.currentY = yPos;
  }

  private generateTotals() {
    const subtotal = Number(this.order.totalAmount);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    this.doc.moveDown(2)
      .font('Helvetica-Bold')
      .text('Sub Total', 350, this.currentY + 20)
      .font('Helvetica')
      .text(`$${subtotal.toFixed(2)}`, 450, this.currentY + 20);

    this.doc.font('Helvetica-Bold')
      .text('Tax', 350, this.currentY + 40)
      .font('Helvetica')
      .text(`$${tax.toFixed(2)}`, 450, this.currentY + 40);

    this.doc.font('Helvetica-Bold')
      .text('TOTAL', 350, this.currentY + 60)
      .font('Helvetica')
      .text(`$${total.toFixed(2)}`, 450, this.currentY + 60);
  }

  private generateFooter() {
    this.doc.moveDown(2)
      .font('Helvetica-Bold')
      .text('Payment Method:')
      .font('Helvetica')
      .text(`Method: ${this.order.paymentMethod}`)
      .text(`Status: ${this.order.paymentStatus}`);

    this.doc.moveDown(2)
      .font('Helvetica-Bold')
      .text('Terms and Conditions:')
      .font('Helvetica')
      .fontSize(10)
      .text('Thank you for your order! For any queries, please contact customer support.');
  }

  public async generate(): Promise<string> {
    const invoicePath = path.join(__dirname, `../../invoices/invoice-${this.order.id}.pdf`);

    if (!fs.existsSync(path.dirname(invoicePath))) {
      fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
    }

    const writeStream = fs.createWriteStream(invoicePath);
    this.doc.pipe(writeStream);

    this.generateHeader();
    this.generateCustomerInfo();
    this.generateTable();
    this.generateTotals();
    this.generateFooter();

    this.doc.end();

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => resolve(invoicePath));
      writeStream.on('error', reject);
    });
  }
}