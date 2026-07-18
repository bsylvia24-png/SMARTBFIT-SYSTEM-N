import { Request, Response } from 'express';
import Product from '../models/Product';
import Seller from '../models/Seller';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sellerId, verifiedOnly } = req.query;
    
    let filter: any = {};
    
    if (category) filter.category = category;
    if (sellerId) filter.sellerId = sellerId;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let products = await Product.find(filter).populate('sellerId', 'storeName verifiedStatus rating');
    
    if (verifiedOnly === 'true') {
      products = products.filter((p: any) => p.sellerId?.verifiedStatus === true);
    }

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'storeName verifiedStatus rating');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: any, res: Response) => {
  try {
    const { name, description, price, images, category, sizes, colors, stock } = req.body;
    
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(403).json({ message: 'Only registered sellers can create products' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      category,
      sizes,
      colors,
      stock,
      sellerId: seller._id
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req: any, res: Response) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own products' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req: any, res: Response) => {
  try {
    const seller = await Seller.findOne({ userId: req.user.id });
    if (!seller) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== seller._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own products' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
