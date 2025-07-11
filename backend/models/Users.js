const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String , required: true },
  email: { type: String , required: true , unique: true }, 
  password: { type: String , required: true , minlength: 6 },
  college_id: { type: Number , required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
});

userSchema.plugin(uniqueValidator); 
module.exports = mongoose.model('User', userSchema);
