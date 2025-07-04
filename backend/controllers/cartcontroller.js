const Cart = require('../models/Cart');
const Food = require('../models/fooditems');

// Add item to cart (nested by canteen)
exports.addToCart = async (req, res) => {
  const { userId, foodId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    const foodItem = await Food.findById(foodId);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    const canteenId = foodItem.canteen;

    if (!cart) {
      // Create new cart for user
      cart = new Cart({
        user: userId,
        canteens: [{
          canteen: canteenId,
          items: [{ food: foodId, quantity: quantity || 1 }]
        }]
      });
    } else {
      // Find canteen group
      let canteenGroup = cart.canteens.find(c => c.canteen.toString() === canteenId.toString());
      if (!canteenGroup) {
        // Add new canteen group
        cart.canteens.push({
          canteen: canteenId,
          items: [{ food: foodId, quantity: quantity || 1 }]
        });
      } else {
        // Check if item already in canteen group
        const itemIndex = canteenGroup.items.findIndex(item => item.food.toString() === foodId);
        if (itemIndex > -1) {
          // Update quantity
          canteenGroup.items[itemIndex].quantity += quantity || 1;
        } else {
          // Add new item
          canteenGroup.items.push({ food: foodId, quantity: quantity || 1 });
        }
      }
    }
    await cart.save();
    // Populate for frontend
    await cart.populate('canteens.canteen').populate('canteens.items.food');
    res.json({ success: true, message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get cart for user
exports.getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate('canteens.canteen')
      .populate('canteens.items.food');
    if (!cart) {
      return res.json({ success: true, cart: { canteens: [] } });
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
    cart.canteens.forEach(cg => {
      cg.items = cg.items.filter(item => item.food.toString() !== foodId);
    });
    // Remove empty canteen groups
    cart.canteens = cart.canteens.filter(cg => cg.items.length > 0);
    await cart.save();
    await cart.populate('canteens.canteen').populate('canteens.items.food');
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
    let found = false;
    cart.canteens.forEach(cg => {
      const item = cg.items.find(item => item.food.toString() === foodId);
      if (item) {
        item.quantity = quantity;
        found = true;
      }
    });
    if (!found) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
    await cart.save();
    await cart.populate('canteens.canteen').populate('canteens.items.food');
    res.json({ success: true, message: 'Cart item updated', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Clear all items of a canteen from user's cart
exports.clearCanteenFromCart = async (req, res) => {
  const { userId, canteenId } = req.body;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }
    // Remove the canteen group matching canteenId
    cart.canteens = cart.canteens.filter(
      cg => cg.canteen.toString() !== canteenId
    );
    await cart.save();
    await cart.populate('canteens.canteen').populate('canteens.items.food');
    res.json({ success: true, message: 'Canteen items cleared from cart', cart });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};