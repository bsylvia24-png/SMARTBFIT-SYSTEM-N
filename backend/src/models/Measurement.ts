import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  height: { type: Number, required: true }, // cm
  weight: { type: Number, required: true }, // kg
  chest: { type: Number, required: true }, // cm
  waist: { type: Number, required: true }, // cm
  hips: { type: Number, required: true }, // cm
  inseam: { type: Number, required: true }, // cm
  gender: { type: String, enum: ['male', 'female'], required: true },
  fitPreference: { type: String, enum: ['tight', 'regular', 'loose'], default: 'regular' },
  fabricStretch: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'medium' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Measurement', MeasurementSchema);
