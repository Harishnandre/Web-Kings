const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  food: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, default: 1, min: 1 }
});

const canteenCartSchema = new Schema({
  canteen: { type: Schema.Types.ObjectId, ref: 'Canteen', required: true },
  items: [cartItemSchema]
});

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  canteens: [canteenCartSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
