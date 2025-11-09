const express = require('express');
const authMiddleware = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', dashboardController.getStats);

module.exports = router;
