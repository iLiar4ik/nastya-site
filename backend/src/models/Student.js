const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  first_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  grade: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  birth_date: {
    type: DataTypes.DATEONLY
  },
  phone: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(255)
  },
  address: {
    type: DataTypes.TEXT
  },
  parent_name: {
    type: DataTypes.STRING(255)
  },
  parent_phone: {
    type: DataTypes.STRING(50)
  },
  parent_email: {
    type: DataTypes.STRING(255)
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'active'
  },
  tariff: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
Student.belongsTo(User, { foreignKey: 'user_id', as: 'teacher' });

module.exports = Student;


