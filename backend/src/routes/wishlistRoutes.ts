import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken as any, getWishlist as any);
router.post('/add', authenticateToken as any, addToWishlist as any);
router.delete('/remove', authenticateToken as any, removeFromWishlist as any);

export default router;
