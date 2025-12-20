const { Lesson, Student } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

class LessonService {
  async getAll(userId, filters = {}, pagination = {}) {
    const { page = 1, limit = 10, studentId = '', status = '', startDate = '', endDate = '' } = filters;
    const offset = (page - 1) * limit;

    const where = {
      user_id: userId
    };

    if (studentId) {
      where.student_id = studentId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date[Op.gte] = startDate;
      }
      if (endDate) {
        where.date[Op.lte] = endDate;
      }
    }

    const { count, rows } = await Lesson.findAndCountAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        required: false,
        attributes: ['id', 'first_name', 'last_name', 'grade']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['date', 'DESC'], ['time', 'DESC']]
    });

    return {
      lessons: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    };
  }

  async getById(id, userId) {
    const lesson = await Lesson.findOne({
      where: {
        id,
        user_id: userId
      },
      include: [{
        model: Student,
        as: 'student',
        required: false
      }]
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    return lesson;
  }

  async create(data, userId) {
    // Check for schedule conflicts
    const conflict = await this.checkScheduleConflict(
      userId,
      data.date,
      data.time,
      data.duration,
      null // new lesson, no id to exclude
    );

    if (conflict) {
      throw new Error('Schedule conflict: Another lesson exists at this time');
    }

    const lessonData = {
      ...data,
      user_id: userId
    };

    const lesson = await Lesson.create(lessonData);
    return await this.getById(lesson.id, userId);
  }

  async update(id, data, userId) {
    const lesson = await Lesson.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    // Check for schedule conflicts (excluding current lesson)
    if (data.date || data.time || data.duration) {
      const conflict = await this.checkScheduleConflict(
        userId,
        data.date || lesson.date,
        data.time || lesson.time,
        data.duration || lesson.duration,
        id // exclude current lesson
      );

      if (conflict) {
        throw new Error('Schedule conflict: Another lesson exists at this time');
      }
    }

    await lesson.update(data);
    return await this.getById(id, userId);
  }

  async delete(id, userId) {
    const lesson = await Lesson.findOne({
      where: {
        id,
        user_id: userId
      }
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    await lesson.destroy();
    return { message: 'Lesson deleted successfully' };
  }

  async checkScheduleConflict(userId, date, time, duration, excludeLessonId = null) {
    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    const where = {
      user_id: userId,
      date: date,
      status: {
        [Op.ne]: 'cancelled'
      }
    };

    if (excludeLessonId) {
      where.id = { [Op.ne]: excludeLessonId };
    }

    const lessons = await Lesson.findAll({
      where,
      attributes: ['id', 'time', 'duration']
    });

    for (const lesson of lessons) {
      const lessonStart = new Date(`${date}T${lesson.time}`);
      const lessonEnd = new Date(lessonStart.getTime() + lesson.duration * 60000);

      // Check if time ranges overlap
      if (startTime < lessonEnd && endTime > lessonStart) {
        return true;
      }
    }

    return false;
  }

  async getSchedule(userId, startDate, endDate) {
    const where = {
      user_id: userId,
      date: {
        [Op.between]: [startDate, endDate]
      }
    };

    const lessons = await Lesson.findAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        required: false,
        attributes: ['id', 'first_name', 'last_name', 'grade']
      }],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });

    return lessons;
  }

  async getUpcoming(userId, limit = 10) {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];

    const lessons = await Lesson.findAll({
      where: {
        user_id: userId,
        [Op.or]: [
          {
            date: {
              [Op.gt]: today
            }
          },
          {
            date: today,
            time: {
              [Op.gte]: now
            }
          }
        ],
        status: {
          [Op.ne]: 'cancelled'
        }
      },
      include: [{
        model: Student,
        as: 'student',
        required: false,
        attributes: ['id', 'first_name', 'last_name', 'grade']
      }],
      order: [['date', 'ASC'], ['time', 'ASC']],
      limit: parseInt(limit)
    });

    return lessons;
  }

  async calculatePrice(lesson) {
    // Get student's tariff
    const student = await Student.findByPk(lesson.student_id);
    if (!student) {
      return 0;
    }

    // Tariff prices (should be in config or database)
    const tariffPrices = {
      'basic': 1500,
      'standard': 1800,
      'advanced': 2200,
      'oge': 1800,
      'ege': 2200,
      'intensive': 2200
    };

    const basePrice = tariffPrices[student.tariff] || 1500;
    const durationMultiplier = lesson.duration / 60;
    return Math.round(basePrice * durationMultiplier);
  }
}

module.exports = new LessonService();


