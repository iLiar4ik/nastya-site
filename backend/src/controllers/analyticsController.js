const analyticsService = require('../services/analyticsService');

class AnalyticsController {
  async getOverview(req, res, next) {
    try {
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const overview = await analyticsService.getOverview(req.user.id, dateRange);
      res.json(overview);
    } catch (error) {
      next(error);
    }
  }

  async getStudentProgress(req, res, next) {
    try {
      const { studentId } = req.params;
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const progress = await analyticsService.getStudentProgress(
        parseInt(studentId),
        req.user.id,
        dateRange
      );
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getRevenue(req, res, next) {
    try {
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const revenue = await analyticsService.getRevenueStatistics(req.user.id, dateRange);
      res.json(revenue);
    } catch (error) {
      next(error);
    }
  }

  async getAttendance(req, res, next) {
    try {
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const attendance = await analyticsService.getAttendanceRate(req.user.id, dateRange);
      res.json(attendance);
    } catch (error) {
      next(error);
    }
  }

  async getGradeDistribution(req, res, next) {
    try {
      const distribution = await analyticsService.getGradeDistribution(req.user.id);
      res.json(distribution);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();


