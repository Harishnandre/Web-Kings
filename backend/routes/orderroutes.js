const express = require('express');
const router = express.Router();
const orderController = require('../controllers/ordercontroller');


// Place order
router.post('/',  orderController.placeOrder);

// Get user orders
router.get('/user/:userId', orderController.getUserOrders);

// Get canteen orders
router.get('/canteen/:canteenId',orderController.getCanteenOrders);

// Update status
router.patch('/:orderId/status', orderController.updateOrderStatus);


router.patch('/cancel/:orderId', orderController.cancelOrder);

module.exports = router;
