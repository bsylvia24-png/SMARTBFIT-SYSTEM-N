import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: { type: String, enum: ['tops', 'bottoms', 'dresses', 'shoes', 'accessories'], required: true },
  sizes: [{
    sizeLabel: { type: String, required: true }, // S, M, L, 32, 42, etc.
    measurements: {
      chest: { type: Number },
      waist: { type: Number },
      hips: { type: Number },
      inseam: { type: Number }
    }
  }],
  colors: [{ type: String }],
  stock: { type: Number, default: 10 },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  rating: { type: Number, default: 5.0 },
  reviewsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', ProductSchema);
