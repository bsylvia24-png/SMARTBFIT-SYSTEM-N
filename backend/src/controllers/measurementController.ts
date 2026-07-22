import { Response } from 'express';
import Measurement from '../models/Measurement';

export const getMeasurements = async (req: any, res: Response) => {
  try {
    const measurements = await Measurement.findOne({ userId: req.user.id });
    if (!measurements) {
      return res.status(404).json({ message: 'No measurements found' });
    }
    res.json(measurements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const saveMeasurements = async (req: any, res: Response) => {
  try {
    const { height, weight, chest, waist, hips, inseam, gender, fitPreference, fabricStretch } = req.body;
    
    // Validate inputs
    if (!height || isNaN(Number(height)) || Number(height) <= 0) {
      return res.status(400).json({ message: 'Valid height is required.' });
    }
    if (!weight || isNaN(Number(weight)) || Number(weight) <= 0) {
      return res.status(400).json({ message: 'Valid weight is required.' });
    }
    if (!chest || isNaN(Number(chest)) || Number(chest) <= 0) {
      return res.status(400).json({ message: 'Valid chest measurement is required.' });
    }
    if (!waist || isNaN(Number(waist)) || Number(waist) <= 0) {
      return res.status(400).json({ message: 'Valid waist measurement is required.' });
    }
    if (!hips || isNaN(Number(hips)) || Number(hips) <= 0) {
      return res.status(400).json({ message: 'Valid hips measurement is required.' });
    }
    if (!inseam || isNaN(Number(inseam)) || Number(inseam) <= 0) {
      return res.status(400).json({ message: 'Valid inseam measurement is required.' });
    }
    if (!gender || !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({ message: 'Gender must be male, female, or other.' });
    }

    // Calculate recommended size based on chest measurement
    const chestVal = Number(chest);
    let recommendedSize = 'M';
    if (chestVal < 36) recommendedSize = 'S';
    else if (chestVal >= 36 && chestVal < 39) recommendedSize = 'M';
    else if (chestVal >= 39 && chestVal < 42) recommendedSize = 'L';
    else if (chestVal >= 42 && chestVal < 45) recommendedSize = 'XL';
    else if (chestVal >= 45) recommendedSize = 'XXL';

    // Calculate fit compatibility score
    let fitScore = 94;
    if (fitPreference === 'slim' || fitPreference === 'tight') fitScore = 97;
    else if (fitPreference === 'loose') fitScore = 92;

    let measurements = await Measurement.findOne({ userId: req.user.id });
    
    if (measurements) {
      measurements.height = height;
      measurements.weight = weight;
      measurements.chest = chest;
      measurements.waist = waist;
      measurements.hips = hips;
      measurements.inseam = inseam;
      measurements.gender = gender === 'other' ? 'male' : gender; // Ensure compat with Mongoose enum ['male', 'female']
      measurements.fitPreference = fitPreference === 'slim' ? 'tight' : fitPreference; // Ensure compat with schema enum
      measurements.fabricStretch = fabricStretch;
      (measurements as any).recommendedSize = recommendedSize;
      (measurements as any).fitScore = fitScore;
      measurements.updatedAt = new Date();
      await measurements.save();
    } else {
      measurements = new Measurement({
        userId: req.user.id,
        height,
        weight,
        chest,
        waist,
        hips,
        inseam,
        gender: gender === 'other' ? 'male' : gender,
        fitPreference: fitPreference === 'slim' ? 'tight' : fitPreference,
        fabricStretch,
        recommendedSize,
        fitScore
      } as any);
      await measurements.save();
    }

    res.json(measurements);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMeasurements = async (req: any, res: Response) => {
  try {
    await Measurement.findOneAndDelete({ userId: req.user.id });
    res.json({ message: 'Measurements deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
