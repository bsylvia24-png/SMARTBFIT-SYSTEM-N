import { Response } from 'express';
import Wishlist from '../models/Wishlist';

export const getWishlist = async (req: any, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id }).populate('products');
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
      await wishlist.save();
    }
    res.json(wishlist.products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addToWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, products: [] });
    }
    
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    res.json({ message: 'Added to wishlist', products: wishlist.products });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromWishlist = async (req: any, res: Response) => {
  try {
    const { productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
      await wishlist.save();
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
