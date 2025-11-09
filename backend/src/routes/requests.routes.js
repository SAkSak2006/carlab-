const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/auth');
const requestsController = require('../controllers/requestsController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/requests - List all requests (with filters)
router.get('/', requestsController.listRequests);

// GET /api/requests/:id - Get request details
router.get('/:id', requestsController.getRequest);

// PATCH /api/requests/:id/status - Update request status
router.patch('/:id/status', [
  body('status').isIn(['new', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
], requestsController.updateStatus);

// PATCH /api/requests/:id/assign - Assign master
router.patch('/:id/assign', [
  body('masterName').notEmpty().withMessage('Master name is required')
], requestsController.assignMaster);

// PATCH /api/requests/:id/progress - Update progress
router.patch('/:id/progress', [
  body('progress').isInt({ min: 0, max: 100 }).withMessage('Progress must be between 0 and 100')
], requestsController.updateProgress);

// POST /api/requests/:id/works - Add work item
router.post('/:id/works', [
  body('workName').notEmpty().withMessage('Work name is required'),
  body('quantity').isFloat({ min: 0.01 }).withMessage('Quantity must be positive'),
  body('unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive')
], requestsController.addWork);

// DELETE /api/requests/:id/works/:workId - Delete work item
router.delete('/:id/works/:workId', requestsController.deleteWork);

// PATCH /api/requests/:id/payment - Update payment status
router.patch('/:id/payment', [
  body('paymentStatus').isIn(['unpaid', 'partially_paid', 'paid']).withMessage('Invalid payment status')
], requestsController.updatePayment);

module.exports = router;
