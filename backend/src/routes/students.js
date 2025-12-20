const express = require('express');
const { body, query, param } = require('express-validator');
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication and rate limiting
router.use(authenticate);
router.use(apiLimiter);

// Validation rules
const createValidation = [
  body('first_name').notEmpty().withMessage('First name is required'),
  body('last_name').notEmpty().withMessage('Last name is required'),
  body('grade').notEmpty().withMessage('Grade is required'),
  body('tariff').notEmpty().withMessage('Tariff is required')
];

const updateValidation = [
  param('id').isInt().withMessage('Invalid student ID')
];

// Routes
router.get('/', studentController.getAll);
router.get('/statistics', studentController.getStatistics);
router.get('/:id', param('id').isInt(), handleValidationErrors, studentController.getById);
router.post('/', createValidation, handleValidationErrors, studentController.create);
router.put('/:id', updateValidation, handleValidationErrors, studentController.update);
router.delete('/:id', updateValidation, handleValidationErrors, studentController.delete);

module.exports = router;

