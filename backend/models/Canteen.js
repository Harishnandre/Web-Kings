const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import dependent models
const Food = require('./fooditems');
const Cart = require('./Cart');

const canteenSchema = new Schema({
  name: { type: String, required: true },
  openingtime: { type: String, required: true },
  closingtime: { type: String, required: true },
  creator: { type: String, required: true },
  food: [{ type: Schema.Types.ObjectId, required: true, ref: 'Food' }],

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
canteenSchema.methods.calculateAvgRating = function () {
  if (this.ratings.length === 0) {
    this.avgRating = 0;
  } else {
    const total = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.avgRating = total / this.ratings.length;
  }
  return this.save();
};

// ♻️ Cascade delete logic
canteenSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const canteenId = doc._id;

  try {
    // 1. Delete food items
    await Food.deleteMany({ canteen: canteenId });

    // 2. Remove canteen from user carts
    await Cart.updateMany(
      {},
      { $pull: { canteens: { canteen: canteenId } } }
    );
  } catch (err) {
    console.error('❌ Cascade delete failed:', err);
  }
});

module.exports = mongoose.model('Canteen', canteenSchema);
