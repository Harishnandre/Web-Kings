const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = require('./Cart');

const foodSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  canteen: { type: Schema.Types.ObjectId, ref: 'Canteen', required: true },
  ratings: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
  avgRating: { type: Number, default: 0 },
  timesOrdered: { type: Number, default: 0 }
});

// 📌 Calculate average rating
foodSchema.methods.calculateAvgRating = function () {
  if (this.ratings.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = total / this.ratings.length;
  }
  return this.save();
};

// ♻️ Cleanup on delete
foodSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;
  const foodId = doc._id;

  try {
    await Cart.updateMany(
      {},
      { $pull: { 'canteens.$[].items': { food: foodId } } }
    );

    const carts = await Cart.find();
    for (const cart of carts) {
      const updatedCanteens = cart.canteens.filter(cg => cg.items.length > 0);
      if (updatedCanteens.length === 0) {
        await Cart.findByIdAndDelete(cart._id);
      } else {
        cart.canteens = updatedCanteens;
        await cart.save();
      }
    }
  } catch (err) {
    console.error('❌ Food cleanup error:', err);
  }
});

module.exports = mongoose.model('Food', foodSchema);
