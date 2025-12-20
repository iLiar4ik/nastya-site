const express = require('express');
const { body, param, query } = require('express-validator');
const materialController = require('../controllers/materialController');
const { authenticate } = require('../middleware/auth');
const { requireTeacherOrAdmin } = require('../middleware/roleAuth');
const { apiLimiter } = require('../middleware/rateLimiter');
const { handleValidationErrors } = require('../middleware/validator');
const upload = require('../config/multer');

const router = express.Router();

// All routes require authentication
router.use(authenticate);
router.use(apiLimiter);

// Routes
router.post('/', [
  body('title').notEmpty().withMessage('Title is required'),
  handleValidationErrors
], requireTeacherOrAdmin, upload.single('file'), materialController.create);

router.get('/', [
  query('createdBy').optional().isInt(),
  query('fileType').optional().isString(),
  handleValidationErrors
], materialController.getAll);

router.get('/:id', [
  param('id').isInt(),
  handleValidationErrors
], materialController.getById);

router.put('/:id', [
  param('id').isInt(),
  body('title').optional().notEmpty(),
  handleValidationErrors
], materialController.update);

router.delete('/:id', [
  param('id').isInt(),
  handleValidationErrors
], materialController.delete);

router.get('/student/:studentId', [
  param('studentId').isInt(),
  handleValidationErrors
], materialController.getByStudent);

router.get('/:id/download', [
  param('id').isInt(),
  handleValidationErrors
], materialController.download);

router.post('/:id/assign', [
  param('id').isInt(),
  body('studentId').isInt().withMessage('Student ID is required'),
  handleValidationErrors
], requireTeacherOrAdmin, materialController.assignToStudent);

router.post('/:id/unassign', [
  param('id').isInt(),
  body('studentId').isInt().withMessage('Student ID is required'),
  handleValidationErrors
], requireTeacherOrAdmin, materialController.unassignFromStudent);

module.exports = router;

