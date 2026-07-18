import mongoose from 'mongoose';

const SellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  storeName: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  verifiedStatus: { type: Boolean, default: false },
  rating: { type: Number, default: 5.0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Seller', SellerSchema);
