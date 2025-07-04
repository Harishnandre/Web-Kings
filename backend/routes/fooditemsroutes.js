const express=require("express");
const { createFood, getAllFood, getFoodById, updateFood, deleteFood } = require('../controllers/fooditemcontroller');

const router = express.Router();
// Food routes
router.post('/food', createFood);
router.get('/food', getAllFood);
router.get('/food/:id', getFoodById);
router.put('/food/:id', updateFood);
router.delete('/food/:id', deleteFood);
module.exports = router;