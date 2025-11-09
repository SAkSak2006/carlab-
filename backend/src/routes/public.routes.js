const express = require('express');
const { body } = require('express-validator');
const publicController = require('../controllers/publicController');

const router = express.Router();

// POST /api/public/requests - Submit new request from landing page
router.post('/requests', [
  body('client.firstName').notEmpty().withMessage('First name is required'),
  body('client.phone').notEmpty().withMessage('Phone is required'),
  body('vehicle.brand').notEmpty().withMessage('Vehicle brand is required'),
  body('vehicle.model').notEmpty().withMessage('Vehicle model is required'),
  body('description').notEmpty().withMessage('Description is required')
], publicController.createRequest);

// GET /api/public/track/:token - Track request by token
router.get('/track/:token', publicController.trackRequest);

// GET /api/public/track/number/:requestNumber - Track request by number
router.get('/track/number/:requestNumber', publicController.trackByNumber);

module.exports = router;
