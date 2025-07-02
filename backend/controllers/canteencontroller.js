const Canteen = require('../models/Canteen');
const { validationResult } = require('express-validator');
const Canowner = require("../models/Canowner");
const Food = require("../models/fooditems");
const mongoose = require('mongoose');

// Create a new canteen
exports.createCanteen = async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        message: "Invalid input",
        success: false
      });
    }

    const { name, openingtime, closingtime, creator } = req.body;

    const createdCanteen = new Canteen({
      name,
      openingtime,
      closingtime,
      creator
    });

    // Save the canteen
    await createdCanteen.save();

    // Add canteen reference to owner
    const canteenowner = await Canowner.findOneAndUpdate(
      { email: creator },
      { $push: { canteen: createdCanteen._id } },
      { new: true }
    );

    if (!canteenowner) {
      // Rollback canteen creation if owner not found
      await Canteen.findByIdAndDelete(createdCanteen._id);
      return res.status(422).json({
        message: "Failed, no such user.",
        success: false
      });
    }

    res.status(201).json({
      canteen: createdCanteen.toObject({ getters: true }),
      success: true
    });
  } catch (err) {
    res.status(500).json({
      message: "Some issue occurred, please try again.",
      success: false
    });
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

// Get a single canteen by ID
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
    const canteen = await Canteen.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }
    res.status(200).json({ canteen });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a canteen and its food items
exports.deleteCanteen = async (req, res) => {
  try {
    const canteen = await Canteen.findById(req.params.id);
    if (!canteen) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    // Delete all related food items
    await Food.deleteMany({ _id: { $in: canteen.food } });

    // Delete the canteen
    await Canteen.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Canteen and its food items deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get canteens by canteen owner email
exports.getCanteensByCanOwnEmail = async (req, res) => {
  try {
    const canteens = await Canteen.find({ creator: req.params.email });
    res.status(200).json({ canteens });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
