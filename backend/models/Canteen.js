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
});

// 🧹 Cascade delete logic: when a canteen is deleted
canteenSchema.post('findOneAndDelete', async function (doc) {
  if (!doc) return;

  const canteenId = doc._id;

  try {
    // 1. Delete all food items belonging to the canteen
    await Food.deleteMany({ canteen: canteenId });

    // 2. Remove this canteen from all user carts
    await Cart.updateMany(
      {},
      { $pull: { canteens: { canteen: canteenId } } }
    );
  } catch (err) {
    console.error('❌ Cascade delete failed:', err);
  }
});

module.exports = mongoose.model('Canteen', canteenSchema);
