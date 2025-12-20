const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Lesson = require('./Lesson');

const LessonNote = sequelize.define('LessonNote', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'lessons',
      key: 'id'
    }
  },
  note_text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'lesson_notes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
LessonNote.belongsTo(Lesson, { foreignKey: 'lesson_id', as: 'lesson' });

module.exports = LessonNote;


