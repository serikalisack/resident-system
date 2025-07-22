// backend/routes/households.js
const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protect all household routes
router.use(verifyToken);

router.get('/', householdController.getAllHouseholds);
router.get('/:id', householdController.getHouseholdById);
router.post('/', householdController.createHousehold);
router.put('/:id', householdController.updateHousehold);
router.delete('/:id', householdController.deleteHousehold);

module.exports = router;
