const express = require('express');
const { body, param, query } = require('express-validator');
const lessonController = require('../controllers/lessonController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication and rate limiting
router.use(authenticate);
router.use(apiLimiter);

// Validation rules
const createValidation = [
  body('student_id').isInt().withMessage('Student ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format (HH:MM) is required'),
  body('duration').isInt({ min: 30, max: 240 }).withMessage('Duration must be between 30 and 240 minutes')
];

const updateValidation = [
  param('id').isInt().withMessage('Invalid lesson ID')
];

// Routes
router.get('/', lessonController.getAll);
router.get('/schedule', [
  query('startDate').isISO8601(),
  query('endDate').isISO8601()
], handleValidationErrors, lessonController.getSchedule);
router.get('/upcoming', lessonController.getUpcoming);
router.get('/:id', param('id').isInt(), handleValidationErrors, lessonController.getById);
router.post('/', createValidation, handleValidationErrors, lessonController.create);
router.put('/:id', updateValidation, handleValidationErrors, lessonController.update);
router.delete('/:id', updateValidation, handleValidationErrors, lessonController.delete);

module.exports = router;

