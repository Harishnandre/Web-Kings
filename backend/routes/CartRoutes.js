const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartcontroller');

router.post('/add', cartController.addToCart);
router.get('/:userId', cartController.getCart);
router.post('/remove', cartController.removeFromCart);
router.post('/update', cartController.updateCartItem);

module.exports = router;