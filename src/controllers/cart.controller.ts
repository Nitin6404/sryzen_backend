import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';
import cartService from '../services/cart.service';

export class CartController {
  addToCart: RequestHandler = async (req, res, next) => {
    try {
      const cartItem = await cartService.addToCart(req.body);
      res.status(201).json(cartItem);
    } catch (error) {
      next(error);
    }
  };

  getUserCart: RequestHandler = async (req, res, next) => {
    try {
      const cartItems = await cartService.getUserCart(Number(req.params.userId));
      res.json(cartItems);
    } catch (error) {
      next(error);
    }
  };

  updateCartItem: RequestHandler = async (req, res, next) => {
    try {
      const cartItem = await cartService.updateCartItem(
        Number(req.params.id),
        Number(req.params.userId),
        req.body
      );
      res.json(cartItem);
    } catch (error) {
      next(error);
    }
  };

  removeFromCart: RequestHandler = async (req, res, next) => {
    try {
      const result = await cartService.removeFromCart(
        Number(req.params.id),
        Number(req.params.userId)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  clearCart: RequestHandler = async (req, res, next) => {
    try {
      const result = await cartService.clearCart(Number(req.params.userId));
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export default new CartController();