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
    
    let measurements = await Measurement.findOne({ userId: req.user.id });
    
    if (measurements) {
      measurements.height = height;
      measurements.weight = weight;
      measurements.chest = chest;
      measurements.waist = waist;
      measurements.hips = hips;
      measurements.inseam = inseam;
      measurements.gender = gender;
      measurements.fitPreference = fitPreference;
      measurements.fabricStretch = fabricStretch;
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
        gender,
        fitPreference,
        fabricStretch
      });
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
