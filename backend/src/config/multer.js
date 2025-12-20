const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Создаем папку для загрузки файлов, если её нет
const uploadsDir = path.join(__dirname, '../../uploads/materials');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory: ${uploadsDir}`);
  }
} catch (error) {
  console.error(`Error creating uploads directory: ${error.message}`);
  // Продолжаем работу, даже если не удалось создать папку
  // Ошибка произойдет при попытке загрузки файла
}

// Конфигурация хранилища
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

// Фильтр файлов
const fileFilter = (req, file, cb) => {
  // Разрешаем различные типы файлов
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, images, TXT, CSV'), false);
  }
};

// Настройка multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;

