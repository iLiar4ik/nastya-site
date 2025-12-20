const homeworkService = require('../services/homeworkService');

class HomeworkController {
  async create(req, res, next) {
    try {
      const homework = await homeworkService.create(req.body);
      res.status(201).json(homework);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        studentId: req.query.studentId,
        lessonId: req.query.lessonId,
        status: req.query.status,
        dueDateFrom: req.query.dueDateFrom,
        dueDateTo: req.query.dueDateTo
      };
      
      // Если пользователь - ученик, показываем только его ДЗ
      if (req.user.role === 'student' && req.user.student_id) {
        filters.studentId = req.user.student_id;
      }
      
      // Если пользователь - учитель, фильтруем по его ученикам
      if (req.user.role === 'teacher') {
        // Фильтрация будет на уровне сервиса через связи
      }
      
      const homework = await homeworkService.getAll(filters);
      res.json(homework);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const homework = await homeworkService.getById(req.params.id);
      if (!homework) {
        return res.status(404).json({ message: 'Homework not found' });
      }
      
      // Проверка доступа для ученика
      if (req.user.role === 'student' && req.user.student_id !== homework.student_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(homework);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const homework = await homeworkService.getById(req.params.id);
      if (!homework) {
        return res.status(404).json({ message: 'Homework not found' });
      }
      
      // Проверка доступа для ученика
      if (req.user.role === 'student' && req.user.student_id !== homework.student_id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updated = await homeworkService.update(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const homework = await homeworkService.getById(req.params.id);
      if (!homework) {
        return res.status(404).json({ message: 'Homework not found' });
      }
      
      // Только учитель может удалять ДЗ
      if (req.user.role !== 'teacher' && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await homeworkService.delete(req.params.id);
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
        dueDateFrom: req.query.dueDateFrom,
        dueDateTo: req.query.dueDateTo
      };
      
      const homework = await homeworkService.getByStudent(studentId, filters);
      res.json(homework);
    } catch (error) {
      next(error);
    }
  }

  async getByLesson(req, res, next) {
    try {
      const homework = await homeworkService.getByLesson(req.params.lessonId);
      res.json(homework);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HomeworkController();

