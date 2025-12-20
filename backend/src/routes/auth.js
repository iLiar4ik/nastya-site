const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required')
];

const loginValidation = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const refreshValidation = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required')
];

// Routes
router.post('/register', authLimiter, registerValidation, handleValidationErrors, authController.register);
router.post('/login', authLimiter, loginValidation, handleValidationErrors, authController.login);
router.post('/refresh', refreshValidation, handleValidationErrors, authController.refresh);
router.get('/me', authenticate, authController.me);

module.exports = router;

