const Cart = require('../models/Cart');
const Food = require('../models/fooditems');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, foodId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    const foodItem = await Food.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }

    if (!cart) {
      // Create new cart for user
      cart = new Cart({
        user: userId,
        items: [{ food: foodId, quantity: quantity || 1 }]
      });
    } else {
      // Check if item already in cart
      const itemIndex = cart.items.findIndex(item => item.food.toString() === foodId);
      if (itemIndex > -1) {
        // Update quantity
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        // Add new item
        cart.items.push({ food: foodId, quantity: quantity || 1 });
      }
    }
    await cart.save();
    res.json({ success: true, message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get cart for user
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.food');
    if (!cart) {
      return res.json({ success: true, cart: { items: [] } });
    }
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { userId, foodId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.food.toString() !== foodId);
    await cart.save();
    res.json({ success: true, message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  const { userId, foodId, quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    const item = cart.items.find(item => item.food.toString() === foodId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    item.quantity = quantity;
    await cart.save();
    res.json({ success: true, message: 'Cart item updated', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};