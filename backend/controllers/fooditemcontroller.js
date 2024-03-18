// controllers/foodController.js
const Food = require('../models/fooditems');
const Canteen = require('../models/Canteen');
const { validationResult } = require('express-validator');

// Create a new food item

exports.createFood= async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Invalid input"
            });
        }

        const { name, price, imageUrl ,description,creator} = req.body;

     const createdfood = new Food({
      name,
      price,
      imageUrl,
      description,
      creator
      
    });
    

        // Save the new canteen
        
      //  const owner=await Canteen.findById({creator:creator});
      //  if(!owner){
      //   return res.status(422).json({
      //       message: "Failed, no such owner."
      //   });
      //  }
        
    
        // Find the canteen owner and update its canteen array
      const canteen = await Canteen.findOneAndUpdate(
            { name: req.params.name,creator:creator},
            { $push: { food: createdfood } },
            { new: true }
        );
        if (!canteen) {
            return res.status(422).json({
                message: "Failed, no such user.",
                success: false
            });
        }
        await createdfood.save();

        // Respond with the created canteen
        res.status(201).json({ food: createdfood.toObject({ getters: true }) ,success:true});
    } catch (err) {
        res.status(500).json({ message: "Some issue occurred, please try again." +err,success:false});
    }
};

// Get all food items
exports.getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json({ foods });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Get a single food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(200).json({ food });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Update a food item
exports.updateFood = async (req, res) => {
  try {
    const { name, price, imageUrl } = req.body;
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      { name, price, imageUrl },
      { new: true }
    );
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(200).json({ food });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(200).json({ message: 'Food Deleted successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};
