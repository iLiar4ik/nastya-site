const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Lesson = require('./Lesson');
const Student = require('./Student');

const Homework = sequelize.define('Homework', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'pending'
  }
}, {
  tableName: 'homework',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Homework.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });
Homework.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });

module.exports = Homework;

