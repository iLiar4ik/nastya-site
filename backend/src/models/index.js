const User = require('./User');
const Student = require('./Student');
const Lesson = require('./Lesson');
const LessonNote = require('./LessonNote');
const Homework = require('./Homework');
const Material = require('./Material');
const Payment = require('./Payment');
const StudentMaterial = require('./StudentMaterial');
const { sequelize } = require('../config/database');

// Import Student to avoid circular dependency
const StudentModel = require('./Student');
const LessonModel = require('./Lesson');

// Define all associations
StudentModel.hasMany(LessonModel, { foreignKey: 'student_id', as: 'lessons' });
LessonModel.hasMany(LessonNote, { foreignKey: 'lesson_id', as: 'lessonNotes' });

// Homework associations
StudentModel.hasMany(Homework, { foreignKey: 'student_id', as: 'homework' });
LessonModel.hasMany(Homework, { foreignKey: 'lesson_id', as: 'homework' });

// Material associations
User.hasMany(Material, { foreignKey: 'created_by', as: 'materials' });
StudentModel.belongsToMany(Material, { through: StudentMaterial, foreignKey: 'student_id', as: 'materials' });
Material.belongsToMany(StudentModel, { through: StudentMaterial, foreignKey: 'material_id', as: 'students' });

// Payment associations
StudentModel.hasMany(Payment, { foreignKey: 'student_id', as: 'payments' });
User.hasMany(Payment, { foreignKey: 'teacher_id', as: 'payments' });

// User-Student association (for students with accounts)
User.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'studentProfile' });
StudentModel.hasOne(User, { foreignKey: 'student_id', as: 'userAccount' });

module.exports = {
  User,
  Student: StudentModel,
  Lesson: LessonModel,
  LessonNote,
  Homework,
  Material,
  Payment,
  StudentMaterial,
  sequelize
};


