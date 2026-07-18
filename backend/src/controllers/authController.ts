import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Seller from '../models/Seller';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, storeName, description } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer'
    });
    const savedUser = await newUser.save();

    // If role is seller, create Seller profile
    if (role === 'seller') {
      if (!storeName) {
        return res.status(400).json({ message: 'Store name is required for sellers' });
      }
      const existingStore = await Seller.findOne({ storeName });
      if (existingStore) {
        return res.status(400).json({ message: 'Store name is already taken' });
      }
      const newSeller = new Seller({
        userId: savedUser._id,
        storeName,
        description: description || ''
      });
      await newSeller.save();
    }

    // Generate Token
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let sellerProfile = null;
    if (user.role === 'seller') {
      sellerProfile = await Seller.findOne({ userId: user._id });
    }

    res.json({ user, sellerProfile });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, profileImage, storeName, description } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();

    if (user.role === 'seller') {
      const seller = await Seller.findOne({ userId: user._id });
      if (seller) {
        if (storeName) seller.storeName = storeName;
        if (description !== undefined) seller.description = description;
        await seller.save();
      }
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
