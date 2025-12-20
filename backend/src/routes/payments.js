const express = require('express');
const { body, param, query } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { requireTeacherOrAdmin } = require('../middleware/roleAuth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.post('/', [
  body('student_id').isInt().withMessage('Student ID is required'),
  body('amount').isFloat({ min: 0 }).withMessage('Amount must be a positive number'),
  body('payment_date').isISO8601().withMessage('Payment date must be a valid date'),
  handleValidationErrors
], requireTeacherOrAdmin, paymentController.create);

router.get('/', [
  query('studentId').optional().isInt(),
  query('teacherId').optional().isInt(),
  query('status').optional().isString(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  handleValidationErrors
], paymentController.getAll);

router.get('/statistics', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  handleValidationErrors
], requireTeacherOrAdmin, paymentController.getStatistics);

router.get('/:id', [
  param('id').isInt(),
  handleValidationErrors
], paymentController.getById);

router.put('/:id', [
  param('id').isInt(),
  body('amount').optional().isFloat({ min: 0 }),
  body('payment_date').optional().isISO8601(),
  body('status').optional().isString(),
  handleValidationErrors
], requireTeacherOrAdmin, paymentController.update);

router.delete('/:id', [
  param('id').isInt(),
  handleValidationErrors
], requireTeacherOrAdmin, paymentController.delete);

router.get('/student/:studentId', [
  param('studentId').isInt(),
  query('status').optional().isString(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  handleValidationErrors
], paymentController.getByStudent);

router.get('/teacher/:teacherId', [
  param('teacherId').isInt(),
  query('status').optional().isString(),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  handleValidationErrors
], paymentController.getByTeacher);

module.exports = router;

