const Food = require('../models/fooditems');
const Canteen = require('../models/Canteen');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Create a new food item
exports.createFood = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({ message: "Invalid input", success: false });
    }

    const { name, price, imageUrl, description, creator } = req.body;

    const createdFood = new Food({
      name,
      price,
      imageUrl,
      description,
      creator
    });

    // Save the new food first
    await createdFood.save();

    // Update corresponding canteen
    const canteen = await Canteen.findOneAndUpdate(
      { name: req.params.name, creator },
      { $push: { food: createdFood._id } },
      { new: true }
    );

    if (!canteen) {
      // rollback food creation if canteen not found
      await Food.findByIdAndDelete(createdFood._id);
      return res.status(422).json({
        message: "Failed, no such canteen for the creator.",
        success: false
      });
    }

    res.status(201).json({
      food: createdFood.toObject({ getters: true }),
      success: true
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: "Some issue occurred, please try again. " + err.message,
      success: false
    });
  }
};

// Get all food items
exports.getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    res.status(200).json({ foods });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get a single food item by ID
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.status(200).json({ food, success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a food item (name, price, description, imageUrl)
exports.updateFood = async (req, res) => {
  try {
    const { name, price, imageUrl, description } = req.body;

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      { name, price, imageUrl, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Food not found', success: false });
    }

    res.status(200).json({ food: updated, success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error', success: false });
  }
};


// Delete a food item and update the corresponding canteen
exports.deleteFood = async (req, res) => {
  try {
    const foodId = req.params.id;

    // Delete the food item
    const food = await Food.findByIdAndDelete(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    // Remove from any canteen that contains it
    const canteen = await Canteen.findOneAndUpdate(
      { food: new mongoose.Types.ObjectId(foodId) },
      { $pull: { food: new mongoose.Types.ObjectId(foodId) } },
      { new: true }
    );

    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found for this food item' });
    }

    res.status(200).json({ message: 'Food deleted successfully and updated the canteen', success: true });
  } catch (error) {
    console.error('Server Error:', error.message);
    res.status(500).json({ message: 'Server Error: ' + error.message });
  }
};
