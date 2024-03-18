const mongoose=require('mongoose');
const Schema = mongoose.Schema;


const foodSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    description:{String},
    creator: {type:String},
});


module.exports = mongoose.model('Food', foodSchema);