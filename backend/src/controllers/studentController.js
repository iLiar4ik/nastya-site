const studentService = require('../services/studentService');

class StudentController {
  async getAll(req, res, next) {
    try {
      const filters = {
        page: req.query.page,
        limit: req.query.limit,
        search: req.query.search,
        grade: req.query.grade,
        status: req.query.status
      };

      const result = await studentService.getAll(req.user.id, filters);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const student = await studentService.getById(req.params.id, req.user.id);
      res.json({ student });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const student = await studentService.create(req.body, req.user.id);
      res.status(201).json({ student });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const student = await studentService.update(req.params.id, req.body, req.user.id);
      res.json({ student });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await studentService.delete(req.params.id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const statistics = await studentService.getStatistics(req.user.id);
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();


