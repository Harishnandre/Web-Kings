const express = require("express");
const {
  rateFood,
  rateCanteen
} = require('../controllers/ratingscontroller');

const router = express.Router();

// Rating routes
router.post('/food/:id', rateFood);       // Rate a specific food item
router.post('/canteen/:id', rateCanteen); // Rate a specific canteen

module.exports = router;
