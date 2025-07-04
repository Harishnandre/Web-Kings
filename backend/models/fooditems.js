const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = require('./Cart'); // Import Cart model

const foodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  canteen: { type: Schema.Types.ObjectId, ref: 'Canteen', required: true },

  // ⭐ Ratings Feature
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  avgRating: { type: Number, default: 0 }
});

// 📌 Method to calculate average rating
foodSchema.methods.calculateAvgRating = function () {
  if (this.ratings.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = total / this.ratings.length;
  }
  return this.save();
};

// ♻️ Middleware: Cleanup after deleting food
foodSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const foodId = doc._id;
  console.log(`Cleaning up food ${foodId} from all carts...`);

  try {
    // Remove food from carts
    await Cart.updateMany(
      {},
      {
        $pull: { 'canteens.$[].items': { food: foodId } }
      }
    );

    // Clean up empty carts
    const carts = await Cart.find();

    for (const cart of carts) {
      let updatedCanteens = cart.canteens.filter(cg => cg.items.length > 0);

      if (updatedCanteens.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
        console.log(`Deleted entire cart for user ${cart.user} as it became empty.`);
      } else {
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
