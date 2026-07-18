import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticateToken, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken as any, requireRole(['seller', 'admin']) as any, createProduct as any);
router.put('/:id', authenticateToken as any, requireRole(['seller', 'admin']) as any, updateProduct as any);
router.delete('/:id', authenticateToken as any, requireRole(['seller', 'admin']) as any, deleteProduct as any);

export default router;
