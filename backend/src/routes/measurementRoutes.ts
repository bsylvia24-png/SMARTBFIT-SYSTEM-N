import { Router } from 'express';
import { getMeasurements, saveMeasurements, deleteMeasurements } from '../controllers/measurementController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken as any, getMeasurements as any);
router.post('/', authenticateToken as any, saveMeasurements as any);
router.delete('/', authenticateToken as any, deleteMeasurements as any);

export default router;
