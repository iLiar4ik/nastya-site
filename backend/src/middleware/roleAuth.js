/**
 * Middleware для проверки ролей пользователя
 */

/**
 * Проверяет, что пользователь имеет одну из указанных ролей
 * @param {string|string[]} roles - Роль или массив ролей
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

/**
 * Проверяет, что пользователь является учителем
 */
const requireTeacher = requireRole('teacher');

/**
 * Проверяет, что пользователь является учеником
 */
const requireStudent = requireRole('student');

/**
 * Проверяет, что пользователь является админом
 */
const requireAdmin = requireRole('admin');

/**
 * Проверяет, что пользователь является учителем или админом
 */
const requireTeacherOrAdmin = requireRole(['teacher', 'admin');

module.exports = {
  requireRole,
  requireTeacher,
  requireStudent,
  requireAdmin,
  requireTeacherOrAdmin
};

