const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student');
const User = require('./User');

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  topic: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'scheduled'
  },
  homework: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    }
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'lessons',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Lesson.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Lesson.belongsTo(User, { foreignKey: 'user_id', as: 'teacher' });

module.exports = Lesson;


