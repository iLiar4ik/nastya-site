const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Student = require('./Student');
const Material = require('./Material');

const StudentMaterial = sequelize.define('StudentMaterial', {
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
  material_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'materials',
      key: 'id'
    }
  },
  assigned_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'student_materials',
  timestamps: false
});

// Define associations
StudentMaterial.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
StudentMaterial.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });

module.exports = StudentMaterial;

