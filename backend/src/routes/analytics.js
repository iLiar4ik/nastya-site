const express = require('express');
const { param, query } = require('express-validator');
const analyticsController = require('../controllers/analyticsController');
const { authenticate } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');

const router = express.Router();

// All routes require authentication and rate limiting
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.get('/overview', analyticsController.getOverview);
router.get('/students/:studentId/progress', [
  param('studentId').isInt(),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], handleValidationErrors, analyticsController.getStudentProgress);
router.get('/revenue', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], handleValidationErrors, analyticsController.getRevenue);
router.get('/attendance', [
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], handleValidationErrors, analyticsController.getAttendance);
router.get('/grade-distribution', analyticsController.getGradeDistribution);

module.exports = router;

