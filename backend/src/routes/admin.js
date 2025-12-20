const express = require('express');
const { body, param, query } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);
router.use(apiLimiter);

// Routes
router.get('/users', [
  query('role').optional().isIn(['teacher', 'student', 'admin']),
  query('search').optional().isString(),
  handleValidationErrors
], adminController.getAllUsers);

router.get('/users/statistics', adminController.getUserStatistics);

router.get('/users/:id', [
  param('id').isInt(),
  handleValidationErrors
], adminController.getUserById);

router.put('/users/:id/role', [
  param('id').isInt(),
  body('role').isIn(['teacher', 'student', 'admin']).withMessage('Invalid role'),
  handleValidationErrors
], adminController.updateUserRole);

router.delete('/users/:id', [
  param('id').isInt(),
  handleValidationErrors
], adminController.deleteUser);

module.exports = router;

