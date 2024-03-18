// controllers/canteenController.js
const Canteen = require('../models/Canteen');
const { validationResult } = require('express-validator');
const Canowner=require("../models/Canowner");
const mongoose=require('mongoose');
// Create a new canteen
exports.createCanteen = async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                message: "Invalid input",
                success : false
            });
        }

        const { name, openingtime, closingtime, creator } = req.body;

        

        // Create a new canteen
        const createdCanteen = new Canteen({
            name,
            openingtime,
            closingtime,
            creator
        });

        // Save the new canteen
        await createdCanteen.save();

        // Find the canteen owner and update its canteen array
        const canteenowner = await Canowner.findOneAndUpdate(
            { email: creator },
            { $push: { canteen: createdCanteen } },
            { new: true }
        );

        if (!canteenowner) {
            return res.status(422).json({
                message: "Failed, no such user.",
                success : false
            });
        }

        // Respond with the created canteen
        res.status(201).json({ canteen: createdCanteen.toObject({ getters: true }),success:true });
    } catch (err) {
        res.status(500).json({ message: "Some Issue occurred, Please try again.",
        success : false});
    }
};

// Get all canteens
exports.getAllCanteens = async (req, res) => {
  try {
    const canteens = await Canteen.find();
    res.status(200).json({ canteens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single canteen
exports.getCanteenById = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }
    res.status(200).json({ canteen });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a canteen
exports.updateCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }
    res.status(200).json({ canteen });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a canteen
exports.deleteCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findByIdAndDelete(req.params.id);
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }
    res.status(200).json({ message: 'Canteen Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//get canteens by canteen email id
exports.getCanteensByCanOwnEmail = async(req,res) =>{
  try {
    const canteens = await Canteen.find({creator : req.params.email});
    res.status(200).json({ canteens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}