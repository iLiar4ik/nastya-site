const materialService = require('../services/materialService');
const path = require('path');
const fs = require('fs').promises;

class MaterialController {
  async create(req, res, next) {
    try {
      const data = {
        ...req.body,
        created_by: req.user.id
      };
      
      if (req.file) {
        data.file_path = req.file.path;
        data.file_name = req.file.originalname;
        data.file_type = req.file.mimetype;
        data.file_size = req.file.size;
      }
      
      const material = await materialService.create(data);
      res.status(201).json(material);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const filters = {
        createdBy: req.query.createdBy,
        fileType: req.query.fileType
      };
      
      // Если пользователь - ученик, показываем только его материалы
      if (req.user.role === 'student' && req.user.student_id) {
        const materials = await materialService.getByStudent(req.user.student_id);
        return res.json(materials);
      }
      
      const materials = await materialService.getAll(filters);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const material = await materialService.getById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      res.json(material);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const material = await materialService.getById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      // Только создатель или админ может обновлять
      if (material.created_by !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updated = await materialService.update(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const material = await materialService.getById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      // Только создатель или админ может удалять
      if (material.created_by !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await materialService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getByStudent(req, res, next) {
    try {
      const studentId = req.params.studentId || req.user.student_id;
      const materials = await materialService.getByStudent(studentId);
      res.json(materials);
    } catch (error) {
      next(error);
    }
  }

  async download(req, res, next) {
    try {
      const material = await materialService.getById(req.params.id);
      if (!material) {
        return res.status(404).json({ message: 'Material not found' });
      }
      
      const filePath = path.join(process.cwd(), material.file_path);
      
      // Проверяем существование файла
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: 'File not found' });
      }
      
      res.download(filePath, material.file_name);
    } catch (error) {
      next(error);
    }
  }

  async assignToStudent(req, res, next) {
    try {
      const { studentId } = req.body;
      const material = await materialService.assignToStudent(req.params.id, studentId);
      res.json(material);
    } catch (error) {
      next(error);
    }
  }

  async unassignFromStudent(req, res, next) {
    try {
      const { studentId } = req.body;
      await materialService.unassignFromStudent(req.params.id, studentId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MaterialController();

