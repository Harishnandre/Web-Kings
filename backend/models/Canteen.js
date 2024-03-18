const mongoose=require('mongoose');
const Schema = mongoose.Schema;
const canteenSchema = new Schema({
    name:{type:String,required: true},
    openingtime:{type:String,required:true},
    closingtime:{type:String,required:true},
    creator:{type:String,required:true},
    food: [{ type: Schema.Types.ObjectId, required: true, ref: 'Food' }],
});


module.exports = mongoose.model('Canteen', canteenSchema);