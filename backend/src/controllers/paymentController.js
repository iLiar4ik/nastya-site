const paymentService = require('../services/paymentService');

class PaymentController {
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        teacher_id: req.user.id
      };
      
      const payment = await paymentService.create(data);
      res.status(201).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        studentId: req.query.studentId,
        teacherId: req.query.teacherId,
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      
      // Если пользователь - учитель, показываем только его платежи
      if (req.user.role === 'teacher') {
        filters.teacherId = req.user.id;
      }
      
      // Если пользователь - ученик, показываем только его платежи
      if (req.user.role === 'student' && req.user.student_id) {
        filters.studentId = req.user.student_id;
      }
      
      const payments = await paymentService.getAll(filters);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const payment = await paymentService.getById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Проверка доступа
      if (req.user.role === 'student' && req.user.student_id !== payment.student_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      if (req.user.role === 'teacher' && req.user.id !== payment.teacher_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const payment = await paymentService.getById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Только учитель или админ может обновлять
      if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      if (req.user.role === 'teacher' && req.user.id !== payment.teacher_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updated = await paymentService.update(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const payment = await paymentService.getById(req.params.id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
      
      // Только учитель или админ может удалять
      if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      if (req.user.role === 'teacher' && req.user.id !== payment.teacher_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await paymentService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req, res, next) {
    try {
      const studentId = req.params.studentId || req.user.student_id;
      const filters = {
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      
      const payments = await paymentService.getByStudent(studentId, filters);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  async getByTeacher(req, res, next) {
    try {
      const teacherId = req.params.teacherId || req.user.id;
      const filters = {
        status: req.query.status,
        dateFrom: req.query.dateFrom,
        dateTo: req.query.dateTo
      };
      
      const payments = await paymentService.getByTeacher(teacherId, filters);
      res.json(payments);
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const teacherId = req.user.id;
      const dateRange = {
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      
      const statistics = await paymentService.getStatistics(teacherId, dateRange);
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();

