import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 },
    isCustomFit: { type: Boolean, default: false },
    selectedSize: { type: String, required: true },
    color: { type: String }
  }],
  customMeasurements: {
    chest: { type: Number },
    waist: { type: Number },
    hips: { type: Number },
    inseam: { type: Number },
    fabricStretch: { type: String },
    fitPreference: { type: String }
  },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'tailoring', 'quality checked', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  trackingNumber: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', OrderSchema);
