import { Router } from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken as any, createOrder as any);
router.get('/', authenticateToken as any, getOrders as any);
router.put('/:id/status', authenticateToken as any, requireRole(['seller', 'admin']) as any, updateOrderStatus as any);

export default router;
