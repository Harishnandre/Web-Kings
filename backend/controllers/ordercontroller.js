const Order = require('../models/Order');
const User = require('../models/Users');
const Canteen = require('../models/Canteen');
const Food = require('../models/fooditems');

// 📦 Place New Order (No Auth - expects userId in body)
exports.placeOrder = async (req, res) => {
  try {
    const { canteenId, userId, items } = req.body;

    if (!userId || !canteenId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let totalAmount = 0;

    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food) return res.status(404).json({ message: `Food item not found: ${item.food}` });

      totalAmount += food.price * item.quantity;

      // Optional: update food popularity
      food.timesOrdered = (food.timesOrdered || 0) + item.quantity;
      await food.save();
    }

    const newOrder = new Order({
      user: userId,
      canteen: canteenId,
      items,
      totalAmount,
      status: 'Placed',
      placedAt: new Date()
    });

    await newOrder.save();

    // Push order references into User and Canteen (optional)
    await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });
    await Canteen.findByIdAndUpdate(canteenId, { $push: { orders: newOrder._id } });

    return res.status(201).json({
      message: 'Order placed successfully',
      order: newOrder
    });
  } catch (err) {
    console.error('❌ Error placing order:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// 📋 Get Orders for a User
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ user: userId })
      .populate('items.food')
      .populate('canteen', 'name')
      .sort({ placedAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching user orders:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 🏪 Get Orders for a Canteen (for owners)
exports.getCanteenOrders = async (req, res) => {
  try {
    const canteenId = req.params.canteenId;

    const orders = await Order.find({ canteen: canteenId })
      .populate('items.food')
      .populate('user', 'name email')
      .sort({ placedAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error('❌ Error fetching canteen orders:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// 🔄 Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    return res.status(200).json({ message: 'Order status updated', order });
  } catch (err) {
    console.error('❌ Error updating order status:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// ❌ Cancel Order (for user)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancellation if not already completed or cancelled
    if (['Completed', 'Cancelled'].includes(order.status)) {
      return res.status(400).json({
        message: `Order cannot be cancelled as it is already ${order.status}`
      });
    }

    order.status = 'Cancelled';
    order.updatedAt = new Date();
    await order.save();

    return res.status(200).json({
      message: 'Order has been cancelled successfully',
      order
    });
  } catch (err) {
    console.error('❌ Error cancelling order:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
