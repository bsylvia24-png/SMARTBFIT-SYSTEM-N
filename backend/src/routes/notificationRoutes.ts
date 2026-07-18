import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken as any, getNotifications as any);
router.put('/:id/read', authenticateToken as any, markAsRead as any);

export default router;
