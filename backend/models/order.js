const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const orderSchema = new Schema({
name: { type: String, required: true },
address: { type: String, required: true },
paymentId: { type: String },
totalPrice: { type: Number, required: true },
items: { type: Schema.Types.ObjectId, required: true,ref:'Orderitem' },
status: { type: String, default: Pending },
user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

orderSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Order', orderSchema);