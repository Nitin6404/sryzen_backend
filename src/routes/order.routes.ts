import { Router } from 'express';
import { RequestHandler } from 'express';
import orderController from '../controllers/order.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = Router();

const createOrder: RequestHandler = async (req, res, next) => {
  await orderController.createOrder(req, res, next);
};

const getUserOrders: RequestHandler = async (req, res, next) => {
  await orderController.getUserOrders(req, res, next);
};

const getOrderById: RequestHandler = async (req, res, next) => {
  await orderController.getOrderById(req, res, next);
};

const updateOrderStatus: RequestHandler = async (req, res, next) => {
  await orderController.updateOrderStatus(req, res, next);
};

const downloadInvoice: RequestHandler = async (req, res, next) => {
  await orderController.downloadInvoice(req, res, next);
};

router.post('/:userId', validateRequest(createOrderSchema), createOrder);
router.get('/:userId', getUserOrders);
router.get('/detail/:id', getOrderById);
router.put('/:id/status', validateRequest(updateOrderStatusSchema), updateOrderStatus);
router.get('/:id/invoice', downloadInvoice);

export default router;