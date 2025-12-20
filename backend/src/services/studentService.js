const { Student, Lesson } = require('../models');
const { Op } = require('sequelize');

class StudentService {
  async getAll(userId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, search = '', grade = '', status = '' } = filters;
    const offset = (page - 1) * limit;

    const where = {
      user_id: userId
    };

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { last_name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (grade) {
      where.grade = grade;
    }

    if (status) {
      where.status = status;
    }

    const { count, rows } = await Student.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return {
      students: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id, userId) {
    const student = await Student.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [{
        model: Lesson,
        as: 'lessons',
        required: false,
        order: [['date', 'DESC'], ['time', 'DESC']],
        limit: 10
      }]
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  async create(data, userId) {
    const studentData = {
      ...data,
      user_id: userId
    };

    const student = await Student.create(studentData);
    return student;
  }

  async update(id, data, userId) {
    const student = await Student.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    await student.update(data);
    return student;
  }

  async delete(id, userId) {
    const student = await Student.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    await student.destroy();
    return { message: 'Student deleted successfully' };
  }

  async getStatistics(userId) {
    const totalStudents = await Student.count({
      where: { user_id: userId }
    });

    const activeStudents = await Student.count({
      where: {
        user_id: userId,
        status: 'active'
      }
    });

    const trialStudents = await Student.count({
      where: {
        user_id: userId,
        status: 'trial'
      }
    });

    const inactiveStudents = await Student.count({
      where: {
        user_id: userId,
        status: 'inactive'
      }
    });

    // Get students by grade
    const studentsByGrade = await Student.findAll({
      where: { user_id: userId },
      attributes: [
        'grade',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['grade'],
      raw: true
    });

    return {
      total: totalStudents,
      active: activeStudents,
      trial: trialStudents,
      inactive: inactiveStudents,
      byGrade: studentsByGrade.reduce((acc, item) => {
        acc[item.grade] = parseInt(item.count);
        return acc;
      }, {})
    };
  }
}

module.exports = new StudentService();


