const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Helper function to generate readable order numbers
function generateOrderNumber() {
  const prefix = 'ORD-';
  const randomDigits = Math.floor(100000 + Math.random() * 900000); // 6-digit random
  return prefix + randomDigits;
}

const orderItemSchema = new Schema({
  food: { type: Schema.Types.ObjectId, ref: 'Food', required: true },
  quantity: { type: Number, required: true }
});

const orderSchema = new Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    default: generateOrderNumber // 🎯 Generates when new Order is created
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  canteen: { type: Schema.Types.ObjectId, ref: 'Canteen', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Placed', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
    default: 'Placed',
  },
  placedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 🕒 Update timestamp before saving
orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
