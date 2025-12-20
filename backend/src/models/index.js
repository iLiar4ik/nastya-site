try {
  console.log('Loading models...');
  const User = require('./User');
  console.log('✓ User model loaded');
  const Student = require('./Student');
  console.log('✓ Student model loaded');
  const Lesson = require('./Lesson');
  console.log('✓ Lesson model loaded');
  const LessonNote = require('./LessonNote');
  console.log('✓ LessonNote model loaded');
  const Homework = require('./Homework');
  console.log('✓ Homework model loaded');
  const Material = require('./Material');
  console.log('✓ Material model loaded');
  const Payment = require('./Payment');
  console.log('✓ Payment model loaded');
  const StudentMaterial = require('./StudentMaterial');
  console.log('✓ StudentMaterial model loaded');
  const { sequelize } = require('../config/database');
  console.log('✓ Database connection loaded');

  // Import Student to avoid circular dependency
  const StudentModel = require('./Student');
  const LessonModel = require('./Lesson');

  console.log('Defining associations...');
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
  
  console.log('✓ All associations defined');

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
} catch (error) {
  console.error('Error loading models:', error);
  console.error('Error stack:', error.stack);
  throw error;
}


