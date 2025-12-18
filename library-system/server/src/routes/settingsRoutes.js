const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// Public route to check if registration is open
router.get('/public/registration-status', settingsController.checkRegistrationStatus);

// Protected routes (admin)
router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSetting);

module.exports = router;
