const express = require('express');
const { body } = require('express-validator');
const { authenticate } = require('../middleware/auth');
const { Student, Lesson } = require('../models');

const router = express.Router();

// Все routes требуют аутентификации
router.use(authenticate);

// Endpoint для импорта данных
router.post('/import', [
  body('students').optional().isArray(),
  body('lessons').optional().isArray()
], async (req, res, next) => {
  try {
    const { students: studentsData, lessons: lessonsData } = req.body;
    const userId = req.user.id;
    
    let importedStudents = 0;
    let importedLessons = 0;
    const errors = [];

    // Импорт учеников
    if (studentsData && Array.isArray(studentsData)) {
      for (const studentData of studentsData) {
        try {
          const student = await Student.create({
            ...studentData,
            user_id: userId
          });
          importedStudents++;
        } catch (error) {
          errors.push(`Ошибка импорта ученика: ${error.message}`);
        }
      }
    }

    // Импорт уроков
    if (lessonsData && Array.isArray(lessonsData)) {
      for (const lessonData of lessonsData) {
        try {
          const lesson = await Lesson.create({
            ...lessonData,
            user_id: userId
          });
          importedLessons++;
        } catch (error) {
          errors.push(`Ошибка импорта урока: ${error.message}`);
        }
      }
    }

    res.json({
      success: true,
      importedStudents,
      importedLessons,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;


