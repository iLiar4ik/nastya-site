const { Material, Student, StudentMaterial, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs').promises;

class MaterialService {
  /**
   * Создать новый материал
   */
  async create(data) {
    return await Material.create(data);
  }

  /**
   * Получить все материалы
   */
  async getAll(filters = {}) {
    const where = {};
    
    if (filters.createdBy) {
      where.created_by = filters.createdBy;
    }
    
    if (filters.fileType) {
      where.file_type = filters.fileType;
    }

    return await Material.findAll({
      where,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Получить материал по ID
   */
  async getById(id) {
    return await Material.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
  }

  /**
   * Обновить материал
   */
  async update(id, data) {
    const material = await Material.findByPk(id);
    if (!material) {
      throw new Error('Material not found');
    }
    return await material.update(data);
  }

  /**
   * Удалить материал и файл
   */
  async delete(id) {
    const material = await Material.findByPk(id);
    if (!material) {
      throw new Error('Material not found');
    }
    
    // Удаляем файл, если он существует
    if (material.file_path) {
      try {
        const filePath = path.join(process.cwd(), material.file_path);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Продолжаем удаление записи даже если файл не найден
      }
    }
    
    return await material.destroy();
  }

  /**
   * Получить материалы для конкретного ученика
   */
  async getByStudent(studentId) {
    const studentMaterials = await StudentMaterial.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Material,
          as: 'material',
          include: [
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ],
      order: [['assigned_at', 'DESC']]
    });
    
    return studentMaterials.map(sm => sm.material);
  }

  /**
   * Назначить материал ученику
   */
  async assignToStudent(materialId, studentId) {
    const [studentMaterial, created] = await StudentMaterial.findOrCreate({
      where: {
        material_id: materialId,
        student_id: studentId
      },
      defaults: {
        material_id: materialId,
        student_id: studentId
      }
    });
    
    return studentMaterial;
  }

  /**
   * Убрать материал у ученика
   */
  async unassignFromStudent(materialId, studentId) {
    const studentMaterial = await StudentMaterial.findOne({
      where: {
        material_id: materialId,
        student_id: studentId
      }
    });
    
    if (studentMaterial) {
      return await studentMaterial.destroy();
    }
    
    return null;
  }
}

module.exports = new MaterialService();

