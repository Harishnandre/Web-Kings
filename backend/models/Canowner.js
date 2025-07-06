const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const canownerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  canteen: [{ type: Schema.Types.ObjectId, required: true, ref: 'Canteen' }],
});

canownerSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Canowner', canownerSchema);
