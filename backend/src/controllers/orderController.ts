import { Response } from 'express';
import Order from '../models/Order';
import Seller from '../models/Seller';
import Notification from '../models/Notification';

export const createOrder = async (req: any, res: Response) => {
  try {
    const { sellerId, products, customMeasurements, total } = req.body;

    const newOrder = new Order({
      userId: req.user.id,
      sellerId,
      products,
      customMeasurements,
      total
    });

    const savedOrder = await newOrder.save();

    // Create Notification for Seller
    const seller = await Seller.findById(sellerId);
    if (seller) {
      const sellerNotification = new Notification({
        userId: seller.userId,
        message: `New custom order received: #${savedOrder._id}`
      });
      await sellerNotification.save();
    }

    res.status(201).json(savedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req: any, res: Response) => {
  try {
    let orders: any[] = [];
    if (req.user.role === 'seller') {
      const seller = await Seller.findOne({ userId: req.user.id });
      if (seller) {
        orders = await Order.find({ sellerId: seller._id })
          .populate('userId', 'name email')
          .populate('products.productId');
      }
    } else if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('userId', 'name email')
        .populate('sellerId', 'storeName')
        .populate('products.productId');
    } else {
      orders = await Order.find({ userId: req.user.id })
        .populate('sellerId', 'storeName')
        .populate('products.productId');
    }
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req: any, res: Response) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Authorization: seller of the order or admin
    if (req.user.role === 'seller') {
      const seller = await Seller.findOne({ userId: req.user.id });
      if (!seller || order.sellerId.toString() !== seller._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    await order.save();

    // Create Notification for User
    const userNotification = new Notification({
      userId: order.userId,
      message: `Your order #${order._id} status is now: ${order.status}`
    });
    await userNotification.save();

    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
