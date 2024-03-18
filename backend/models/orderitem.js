const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    name: { type: String, required: true },
    Quantity: { type: Number, required: true }

});

orderSchema.plugin(uniqueValidator);
module.exports = mongoose.model('orderitem', orderSchema);