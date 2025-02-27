import { Cart } from '../../database/models/cart.model';
import { MenuItem } from '../../database/models/menu.items.model';
import { AppError } from '../middleware/error.middleware';

export class CartService {
  async addToCart(data: any) {
    try {
      const menuItem = await MenuItem.findByPk(data.menuItemId);
      if (!menuItem) {
        throw new AppError(404, 'Menu item not found');
      }

      const cartItem = await Cart.create({
        userId: data.userId,
        menuItemId: data.menuItemId,
        quantity: data.quantity,
        price: menuItem.price * data.quantity,
        orderId: null // explicitly set to null for new cart items
      });

      return cartItem;
    } catch (error) {
      console.error('Cart creation error:', error); // Add logging
      if (error instanceof AppError) throw error;
      throw new AppError(400, 'Error adding item to cart');
    }
  }

  async getUserCart(userId: number) {
    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: MenuItem, attributes: ['name', 'price'] }],
    });
    return cartItems;
  }

  async updateCartItem(id: number, userId: number, data: any) {
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    const menuItem = await MenuItem.findByPk(cartItem.menuItemId);
    if (!menuItem) {
      throw new AppError(404, 'Menu item not found');
    }

    return await cartItem.update({
      quantity: data.quantity,
      price: menuItem.price * data.quantity,
    });
  }

  async removeFromCart(id: number, userId: number) {
    const cartItem = await Cart.findOne({ where: { id, userId } });
    if (!cartItem) {
      throw new AppError(404, 'Cart item not found');
    }

    await cartItem.destroy();
    return { message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    await Cart.destroy({ where: { userId } });
    return { message: 'Cart cleared successfully' };
  }
}

export default new CartService();