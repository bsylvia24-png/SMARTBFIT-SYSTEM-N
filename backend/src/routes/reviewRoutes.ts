import { Router } from 'express';
import { getReviews, createReview } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/product/:productId', getReviews);
router.post('/', authenticateToken as any, createReview as any);

export default router;
