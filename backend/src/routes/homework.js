const express = require('express');
const { body, param, query } = require('express-validator');
const homeworkController = require('../controllers/homeworkController');
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
  body('title').notEmpty().withMessage('Title is required'),
  body('due_date').isISO8601().withMessage('Due date must be a valid date'),
  handleValidationErrors
], requireTeacherOrAdmin, homeworkController.create);

router.get('/', [
  query('studentId').optional().isInt(),
  query('lessonId').optional().isInt(),
  query('status').optional().isString(),
  query('dueDateFrom').optional().isISO8601(),
  query('dueDateTo').optional().isISO8601(),
  handleValidationErrors
], homeworkController.getAll);

router.get('/:id', [
  param('id').isInt(),
  handleValidationErrors
], homeworkController.getById);

router.put('/:id', [
  param('id').isInt(),
  body('title').optional().notEmpty(),
  body('due_date').optional().isISO8601(),
  handleValidationErrors
], homeworkController.update);

router.delete('/:id', [
  param('id').isInt(),
  handleValidationErrors
], requireTeacherOrAdmin, homeworkController.delete);

router.get('/student/:studentId', [
  param('studentId').isInt(),
  query('status').optional().isString(),
  query('dueDateFrom').optional().isISO8601(),
  query('dueDateTo').optional().isISO8601(),
  handleValidationErrors
], homeworkController.getByStudent);

router.get('/lesson/:lessonId', [
  param('lessonId').isInt(),
  handleValidationErrors
], homeworkController.getByLesson);

module.exports = router;

