const adminService = require('../services/adminService');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        search: req.query.search
      };
      
      const users = await adminService.getAllUsers(filters);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await adminService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const { role } = req.body;
      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }
      
      const user = await adminService.updateUserRole(req.params.id, role);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      // Нельзя удалить самого себя
      if (req.params.id == req.user.id) {
        return res.status(400).json({ message: 'Cannot delete yourself' });
      }
      
      await adminService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getUserStatistics(req, res, next) {
    try {
      const statistics = await adminService.getUserStatistics();
      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();

