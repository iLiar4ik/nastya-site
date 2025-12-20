const User = require('./User');
const Student = require('./Student');
const Lesson = require('./Lesson');
const LessonNote = require('./LessonNote');

// Import Student to avoid circular dependency
const StudentModel = require('./Student');
const LessonModel = require('./Lesson');

// Define all associations
StudentModel.hasMany(LessonModel, { foreignKey: 'student_id', as: 'lessons' });
LessonModel.hasMany(LessonNote, { foreignKey: 'lesson_id', as: 'lessonNotes' });

module.exports = {
  User,
  Student: StudentModel,
  Lesson: LessonModel,
  LessonNote
};


