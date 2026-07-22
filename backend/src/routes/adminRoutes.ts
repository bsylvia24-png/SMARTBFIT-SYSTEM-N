import { Router, Response } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import User from '../models/User';
import Seller from '../models/Seller';
import Measurement from '../models/Measurement';

const router = Router();

// Protect all routes with admin check
router.use(authenticateToken as any);
router.use(requireRole(['admin']) as any);

// GET all users
router.get('/users', async (req: any, res: Response) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET all measurements with user details
router.get('/measurements', async (req: any, res: Response) => {
  try {
    const measurements = await Measurement.find({}).populate('userId', 'name email');
    res.json(measurements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// GET all sellers
router.get('/sellers', async (req: any, res: Response) => {
  try {
    const sellers = await Seller.find({}).populate('userId', 'name email');
    res.json(sellers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// PUT verify/unverify seller
router.put('/sellers/:id/verify', async (req: any, res: Response) => {
  try {
    const { verifiedStatus } = req.body;
    const seller = await Seller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller boutique not found' });
    }
    seller.verifiedStatus = verifiedStatus;
    await seller.save();
    res.json(seller);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
