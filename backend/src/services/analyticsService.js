const { Lesson, Student, sequelize } = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  async getStudentProgress(studentId, userId, dateRange = {}) {
    const { startDate, endDate } = dateRange;
    
    // Verify student belongs to user
    const student = await Student.findOne({
      where: {
        id: studentId,
        user_id: userId
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const where = {
      student_id: studentId,
      user_id: userId
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const lessons = await Lesson.findAll({
      where,
      order: [['date', 'ASC']],
      attributes: ['id', 'date', 'rating', 'status', 'duration', 'topic']
    });

    const completedLessons = lessons.filter(l => l.status === 'completed');
    const totalLessons = lessons.length;
    const averageRating = completedLessons.length > 0
      ? completedLessons.reduce((sum, l) => sum + (l.rating || 0), 0) / completedLessons.length
      : 0;

    return {
      studentId,
      totalLessons,
      completedLessons: completedLessons.length,
      averageRating: Math.round(averageRating * 10) / 10,
      lessons: lessons.map(l => ({
        date: l.date,
        rating: l.rating,
        status: l.status,
        topic: l.topic
      }))
    };
  }

  async getOverallStatistics(userId, dateRange = {}) {
    const { startDate, endDate } = dateRange;

    const where = {
      user_id: userId
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const totalLessons = await Lesson.count({ where });
    const completedLessons = await Lesson.count({
      where: {
        ...where,
        status: 'completed'
      }
    });
    const cancelledLessons = await Lesson.count({
      where: {
        ...where,
        status: 'cancelled'
      }
    });

    const totalStudents = await Student.count({
      where: { user_id: userId }
    });

    const activeStudents = await Student.count({
      where: {
        user_id: userId,
        status: 'active'
      }
    });

    // Average rating
    const ratingResult = await Lesson.findOne({
      where: {
        ...where,
        status: 'completed',
        rating: { [Op.ne]: null }
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ],
      raw: true
    });

    const averageRating = ratingResult?.averageRating 
      ? Math.round(parseFloat(ratingResult.averageRating) * 10) / 10 
      : 0;

    return {
      totalLessons,
      completedLessons,
      cancelledLessons,
      totalStudents,
      activeStudents,
      averageRating,
      completionRate: totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0
    };
  }

  async getRevenueStatistics(userId, dateRange = {}) {
    const { startDate, endDate } = dateRange;

    const where = {
      user_id: userId,
      status: 'completed'
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const lessons = await Lesson.findAll({
      where,
      include: [{
        model: Student,
        as: 'student',
        required: true,
        attributes: ['tariff']
      }],
      attributes: ['duration', 'date']
    });

    // Tariff prices
    const tariffPrices = {
      'basic': 1500,
      'standard': 1800,
      'advanced': 2200,
      'oge': 1800,
      'ege': 2200,
      'intensive': 2200
    };

    let totalRevenue = 0;
    const revenueByMonth = {};

    lessons.forEach(lesson => {
      const basePrice = tariffPrices[lesson.student.tariff] || 1500;
      const price = Math.round(basePrice * (lesson.duration / 60));
      totalRevenue += price;

      const month = lesson.date.toISOString().substring(0, 7); // YYYY-MM
      revenueByMonth[month] = (revenueByMonth[month] || 0) + price;
    });

    return {
      totalRevenue,
      totalLessons: lessons.length,
      averagePerLesson: lessons.length > 0 
        ? Math.round(totalRevenue / lessons.length) 
        : 0,
      revenueByMonth
    };
  }

  async getAttendanceRate(userId, dateRange = {}) {
    const { startDate, endDate } = dateRange;

    const where = {
      user_id: userId
    };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    const totalScheduled = await Lesson.count({
      where: {
        ...where,
        status: { [Op.in]: ['scheduled', 'completed'] }
      }
    });

    const completed = await Lesson.count({
      where: {
        ...where,
        status: 'completed'
      }
    });

    const missed = await Lesson.count({
      where: {
        ...where,
        status: 'missed'
      }
    });

    const attendanceRate = totalScheduled > 0
      ? Math.round((completed / totalScheduled) * 100)
      : 0;

    return {
      totalScheduled,
      completed,
      missed,
      attendanceRate
    };
  }

  async getGradeDistribution(userId) {
    const students = await Student.findAll({
      where: { user_id: userId },
      attributes: [
        'grade',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['grade'],
      raw: true
    });

    return students.reduce((acc, item) => {
      acc[item.grade] = parseInt(item.count);
      return acc;
    }, {});
  }

  async getOverview(userId, dateRange = {}) {
    const overall = await this.getOverallStatistics(userId, dateRange);
    const revenue = await this.getRevenueStatistics(userId, dateRange);
    const attendance = await this.getAttendanceRate(userId, dateRange);
    const gradeDistribution = await this.getGradeDistribution(userId);

    return {
      overall,
      revenue,
      attendance,
      gradeDistribution
    };
  }
}

module.exports = new AnalyticsService();


