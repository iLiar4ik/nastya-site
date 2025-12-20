const { Homework, Student, Lesson } = require('../models');
const { Op } = require('sequelize');

class HomeworkService {
  /**
   * Создать новое ДЗ
   */
  async create(data) {
    return await Homework.create(data);
  }

  /**
   * Получить все ДЗ с фильтрацией
   */
  async getAll(filters = {}) {
    const where = {};
    
    if (filters.studentId) {
      where.student_id = filters.studentId;
    }
    
    if (filters.lessonId) {
      where.lesson_id = filters.lessonId;
    }
    
    if (filters.status) {
      where.status = filters.status;
    }
    
    if (filters.dueDateFrom) {
      where.due_date = { ...where.due_date, [Op.gte]: filters.dueDateFrom };
    }
    
    if (filters.dueDateTo) {
      where.due_date = { ...where.due_date, [Op.lte]: filters.dueDateTo };
    }

    return await Homework.findAll({
      where,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'grade']
        },
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'date', 'time', 'topic'],
          required: false
        }
      ],
      order: [['due_date', 'ASC']]
    });
  }

  /**
   * Получить ДЗ по ID
   */
  async getById(id) {
    return await Homework.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'grade']
        },
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'date', 'time', 'topic'],
          required: false
        }
      ]
    });
  }

  /**
   * Обновить ДЗ
   */
  async update(id, data) {
    const homework = await Homework.findByPk(id);
    if (!homework) {
      throw new Error('Homework not found');
    }
    return await homework.update(data);
  }

  /**
   * Удалить ДЗ
   */
  async delete(id) {
    const homework = await Homework.findByPk(id);
    if (!homework) {
      throw new Error('Homework not found');
    }
    return await homework.destroy();
  }

  /**
   * Получить ДЗ для конкретного ученика
   */
  async getByStudent(studentId, filters = {}) {
    return await this.getAll({ ...filters, studentId });
  }

  /**
   * Получить ДЗ для конкретного урока
   */
  async getByLesson(lessonId) {
    return await this.getAll({ lessonId });
  }
}

module.exports = new HomeworkService();

