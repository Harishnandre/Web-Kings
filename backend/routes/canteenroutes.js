const express = require('express');
const { createCanteen, getAllCanteens, getCanteenById, updateCanteen, deleteCanteen, getCanteensByCanOwnEmail } = require('../controllers/canteencontroller');
const router = express.Router();

// Canteen routes
router.post('/canteen', createCanteen);
router.get('/canteen', getAllCanteens);
router.get('/canteen/:email',getCanteensByCanOwnEmail)
router.get('/canteenbyid/:id', getCanteenById);
router.put('/canteen/:id', updateCanteen);
router.delete('/canteen/:id', deleteCanteen);
module.exports = router;