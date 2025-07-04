const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = require('./Cart'); // Import Cart model

const foodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  canteen: { type: Schema.Types.ObjectId, ref: 'Canteen', required: true }
});

// Middleware: When a food is deleted
foodSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const foodId = doc._id;
  console.log(`Cleaning up food ${foodId} from all carts...`);

  try {
    // Step 1: Remove the food item from all carts
    await Cart.updateMany(
      {},
      {
        $pull: { 'canteens.$[].items': { food: foodId } }
      }
    );

    // Step 2: Fetch all carts to re-check their state
    const carts = await Cart.find();

    for (const cart of carts) {
      let updatedCanteens = cart.canteens.filter(cg => cg.items.length > 0);

      // Step 3: If no canteen has any items, delete entire cart
      if (updatedCanteens.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        console.log(`Deleted entire cart for user ${cart.user} as it became empty.`);
      } else {
        // Else, update the cart with filtered canteens
        cart.canteens = updatedCanteens;
        await cart.save();
        console.log(`Updated cart for user ${cart.user}, removed empty canteens.`);
      }
    }

    console.log(`Food ${foodId} removed from all carts successfully.`);
  } catch (err) {
    console.error('Error during cart cleanup after food deletion:', err);
  }
});

module.exports = mongoose.model('Food', foodSchema);
