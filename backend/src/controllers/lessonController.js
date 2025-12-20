const lessonService = require('../services/lessonService');

class LessonController {
  async getAll(req, res, next) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        studentId: req.query.studentId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };

      const result = await lessonService.getAll(req.user.id, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const lesson = await lessonService.getById(req.params.id, req.user.id);
      res.json({ lesson });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const lesson = await lessonService.create(req.body, req.user.id);
      res.status(201).json({ lesson });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const lesson = await lessonService.update(req.params.id, req.body, req.user.id);
      res.json({ lesson });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await lessonService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSchedule(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: 'startDate and endDate are required' });
      }

      const lessons = await lessonService.getSchedule(req.user.id, startDate, endDate);
      res.json({ lessons });
    } catch (error) {
      next(error);
    }
  }

  async getUpcoming(req, res, next) {
    try {
      const limit = req.query.limit || 10;
      const lessons = await lessonService.getUpcoming(req.user.id, limit);
      res.json({ lessons });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new LessonController();


