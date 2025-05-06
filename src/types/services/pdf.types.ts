export interface InvoiceData {
  orderId: number;
  orderDate: Date;
  restaurantDetails: {
    name: string;
    address: string;
    phone: string;
  };
  customerDetails: {
    name: string;
    address: string;
  };
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
}
