import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Route imports
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import measurementRoutes from './routes/measurementRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import reviewRoutes from './routes/reviewRoutes';
import notificationRoutes from './routes/notificationRoutes';
import adminRoutes from './routes/adminRoutes';

// Models for seeding
import User from './models/User';
import Seller from './models/Seller';
import Product from './models/Product';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartfit';

// Security middleware
app.use(helmet());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/measurements', measurementRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Smart Fit API is running smoothly' });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// Database seeding function
const seedDatabase = async () => {
  try {
    // 1. Seed Admin
    const adminEmail = 'admin@smartfit.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('AdminPassword123', salt);
      const admin = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Seeded default admin account: admin@smartfit.com / AdminPassword123');
    }

    // 2. Seed Customer
    const customerEmail = 'customer@smartfit.com';
    const customerExists = await User.findOne({ email: customerEmail });
    let customerUser;
    if (!customerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('CustomerPassword123', salt);
      customerUser = new User({
        name: 'Chidi Koffi',
        email: customerEmail,
        password: hashedPassword,
        role: 'customer'
      });
      await customerUser.save();
      console.log('Seeded default customer account: customer@smartfit.com / CustomerPassword123');
    } else {
      customerUser = customerExists;
    }

    // 3. Seed Seller
    const sellerEmail = 'seller@smartfit.com';
    const sellerExists = await User.findOne({ email: sellerEmail });
    let sellerUser;
    if (!sellerExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('SellerPassword123', salt);
      sellerUser = new User({
        name: 'Amina Diop',
        email: sellerEmail,
        password: hashedPassword,
        role: 'seller'
      });
      await sellerUser.save();
      console.log('Seeded default seller account: seller@smartfit.com / SellerPassword123');
    } else {
      sellerUser = sellerExists;
    }

    // Seed Seller Profile
    let sellerProfile = await Seller.findOne({ userId: sellerUser._id });
    if (!sellerProfile) {
      sellerProfile = new Seller({
        userId: sellerUser._id,
        storeName: 'Amani Luxury Atelier',
        description: 'Bespoke contemporary African fashion designs with handwoven details.',
        verifiedStatus: true,
        rating: 4.9
      });
      await sellerProfile.save();
      console.log('Seeded seller profile for Amina Diop');
    }

    // 4. Seed Products with high-quality authentic African models images from Unsplash
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const initialProducts = [
        {
          name: 'Classic Kente Print Blazer',
          description: 'Tailored blazer featuring premium Kente fabric accents. Perfect for formal and smart-casual occasions.',
          price: 185,
          category: 'tops',
          images: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=80'],
          sizes: [
            { sizeLabel: 'S', measurements: { chest: 35, waist: 30, hips: 36, inseam: 30 } },
            { sizeLabel: 'M', measurements: { chest: 38, waist: 32, hips: 39, inseam: 31 } },
            { sizeLabel: 'L', measurements: { chest: 41, waist: 35, hips: 42, inseam: 32 } },
            { sizeLabel: 'XL', measurements: { chest: 44, waist: 38, hips: 45, inseam: 33 } }
          ],
          colors: ['Multi-color Print', 'Black Gold'],
          stock: 15,
          sellerId: sellerProfile._id,
          rating: 4.8,
          reviewsCount: 3
        },
        {
          name: 'Amani Flowing Maxi Dress',
          description: 'Elegant maxi dress made of breathable cotton, styled by contemporary African designers.',
          price: 210,
          category: 'dresses',
          images: ['https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=800&auto=format&fit=crop&q=80'],
          sizes: [
            { sizeLabel: 'S', measurements: { chest: 34, waist: 28, hips: 37, inseam: 0 } },
            { sizeLabel: 'M', measurements: { chest: 37, waist: 31, hips: 40, inseam: 0 } },
            { sizeLabel: 'L', measurements: { chest: 40, waist: 34, hips: 43, inseam: 0 } }
          ],
          colors: ['Deep Gold', 'Indigo Print'],
          stock: 12,
          sellerId: sellerProfile._id,
          rating: 5.0,
          reviewsCount: 5
        },
        {
          name: 'Tailored Linen Trouser',
          description: 'Breathable linen pants structured for clean lines, hand-tailored in Dakar.',
          price: 145,
          category: 'bottoms',
          images: ['https://images.unsplash.com/photo-1549069642-7257f85dc192?w=800&auto=format&fit=crop&q=80'],
          sizes: [
            { sizeLabel: 'S', measurements: { chest: 0, waist: 30, hips: 36, inseam: 30 } },
            { sizeLabel: 'M', measurements: { chest: 0, waist: 32, hips: 39, inseam: 32 } },
            { sizeLabel: 'L', measurements: { chest: 0, waist: 35, hips: 42, inseam: 34 } }
          ],
          colors: ['Sand Beige', 'Olive Green'],
          stock: 20,
          sellerId: sellerProfile._id,
          rating: 4.7,
          reviewsCount: 2
        }
      ];
      await Product.insertMany(initialProducts);
      console.log('Seeded initial products database successfully');
    }
  } catch (err: any) {
    console.error('Seeding database failed:', err.message);
  }
};

// Database connection & start server
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB. Starting server in standalone offline fallback mode...', err.message);
    // Start server anyway for verification/fallback compatibility
    app.listen(PORT, () => {
      console.log(`Server started in standalone fallback mode on port ${PORT}`);
    });
  });

export default app;
