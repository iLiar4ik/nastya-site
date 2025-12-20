const { Payment, Student, User } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../models');

class PaymentService {
  /**
   * Создать новый платеж
   */
  async create(data) {
    return await Payment.create(data);
  }

  /**
   * Получить все платежи с фильтрацией
   */
  async getAll(filters = {}) {
    const where = {};
    
    if (filters.studentId) {
      where.student_id = filters.studentId;
    }
    
    if (filters.teacherId) {
      where.teacher_id = filters.teacherId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.dateFrom) {
      where.payment_date = { ...where.payment_date, [Op.gte]: filters.dateFrom };
    }
    
    if (filters.dateTo) {
      where.payment_date = { ...where.payment_date, [Op.lte]: filters.dateTo };
    }

    return await Payment.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'grade']
        },
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['payment_date', 'DESC']]
    });
  }

  /**
   * Получить платеж по ID
   */
  async getById(id) {
    return await Payment.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'grade']
        },
        {
          model: User,
          as: 'teacher',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
  }

  /**
   * Обновить платеж
   */
  async update(id, data) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return await payment.update(data);
  }

  /**
   * Удалить платеж
   */
  async delete(id) {
    const payment = await Payment.findByPk(id);
    if (!payment) {
      throw new Error('Payment not found');
    }
    return await payment.destroy();
  }

  /**
   * Получить платежи для конкретного ученика
   */
  async getByStudent(studentId, filters = {}) {
    return await this.getAll({ ...filters, studentId });
  }

  /**
   * Получить платежи для конкретного учителя
   */
  async getByTeacher(teacherId, filters = {}) {
    return await this.getAll({ ...filters, teacherId });
  }

  /**
   * Получить статистику по платежам
   */
  async getStatistics(teacherId, dateRange = {}) {
    const where = { teacher_id: teacherId };
    
    if (dateRange.startDate) {
      where.payment_date = { ...where.payment_date, [Op.gte]: dateRange.startDate };
    }
    
    if (dateRange.endDate) {
      where.payment_date = { ...where.payment_date, [Op.lte]: dateRange.endDate };
    }

    const totalPayments = await Payment.count({ where });
    
    const totalAmount = await Payment.sum('amount', {
      where: { ...where, status: 'completed' }
    }) || 0;
    
    const pendingAmount = await Payment.sum('amount', {
      where: { ...where, status: 'pending' }
    }) || 0;
    
    const completedPayments = await Payment.count({
      where: { ...where, status: 'completed' }
    });
    
    const pendingPayments = await Payment.count({
      where: { ...where, status: 'pending' }
    });

    return {
      totalPayments,
      totalAmount: parseFloat(totalAmount),
      pendingAmount: parseFloat(pendingAmount),
      completedPayments,
      pendingPayments
    };
  }
}

module.exports = new PaymentService();

