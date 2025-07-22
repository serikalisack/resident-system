// backend/routes/residents.js
const express = require('express');
const router = express.Router();
const residentController = require('../controllers/residentController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protect all resident routes
router.use(verifyToken);

router.get('/', residentController.getAllResidents);
router.get('/:id', residentController.getResidentById);
router.post('/', residentController.createResident);
router.put('/:id', residentController.updateResident);
router.delete('/:id', residentController.deleteResident);

module.exports = router;
