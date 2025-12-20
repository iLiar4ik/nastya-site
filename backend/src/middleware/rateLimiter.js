const rateLimit = require('express-rate-limit');

// Rate limiter для аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5, // максимум 5 запросов
  message: 'Слишком много попыток входа. Попробуйте позже.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter для API запросов
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: 'Слишком много запросов. Попробуйте позже.',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  authLimiter,
  apiLimiter
};


