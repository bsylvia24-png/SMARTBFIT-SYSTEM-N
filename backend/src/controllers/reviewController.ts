import { Request, Response } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';

export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name profileImage');
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req: any, res: Response) => {
  try {
    const { productId, rating, comment } = req.body;

    const newReview = new Review({
      userId: req.user.id,
      productId,
      rating,
      comment
    });

    const savedReview = await newReview.save();

    // Recalculate product rating
    const reviews = await Review.find({ productId });
    const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: Number(avgRating.toFixed(1)),
      reviewsCount: reviews.length
    });

    res.status(201).json(savedReview);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
