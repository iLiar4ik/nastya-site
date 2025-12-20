const { User, Student } = require('../models');
const { Op } = require('sequelize');

class AdminService {
  /**
   * Получить всех пользователей
   */
  async getAllUsers(filters = {}) {
    const where = {};
    
    if (filters.role) {
      where.role = filters.role;
    }
    
    if (filters.search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    return await User.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'studentProfile',
          attributes: ['id', 'first_name', 'last_name', 'grade'],
          required: false
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Получить пользователя по ID
   */
  async getUserById(id) {
    return await User.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'studentProfile',
          attributes: ['id', 'first_name', 'last_name', 'grade'],
          required: false
        }
      ]
    });
  }

  /**
   * Обновить роль пользователя
   */
  async updateUserRole(userId, newRole) {
    const allowedRoles = ['teacher', 'student', 'admin'];
    if (!allowedRoles.includes(newRole)) {
      throw new Error('Invalid role');
    }
    
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return await user.update({ role: newRole });
  }

  /**
   * Удалить пользователя
   */
  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    return await user.destroy();
  }

  /**
   * Получить статистику по пользователям
   */
  async getUserStatistics() {
    const totalUsers = await User.count();
    const teachers = await User.count({ where: { role: 'teacher' } });
    const students = await User.count({ where: { role: 'student' } });
    const admins = await User.count({ where: { role: 'admin' } });
    
    return {
      totalUsers,
      teachers,
      students,
      admins
    };
  }
}

module.exports = new AdminService();

