import { initLayout } from '../dashboard/layout.js';
import { getCurrentPageName } from '../dashboard/utils.js';

// Импортируем страницы для разных ролей
let teacherPages = {};
let studentPages = {};
let adminPages = {};

async function loadPageModules(role) {
  try {
    if (role === 'teacher') {
      teacherPages = {
        schedule: await import('./teacher/schedule.js'),
        payments: await import('./teacher/payments.js'),
        analytics: await import('./teacher/analytics.js'),
        students: await import('./teacher/students.js')
      };
    } else if (role === 'student') {
      studentPages = {
        schedule: await import('./student/schedule.js'),
        homework: await import('./student/homework.js'),
        materials: await import('./student/materials.js')
      };
    } else if (role === 'admin') {
      adminPages = {
        users: await import('./admin/users.js')
      };
    }
  } catch (error) {
    console.error('Error loading page modules:', error);
  }
}

async function renderPage(user, mainContent) {
  const pageName = getCurrentPageName();
  let pageModule = null;
  
  try {
    if (user.role === 'teacher') {
      pageModule = teacherPages[pageName] || teacherPages.schedule;
    } else if (user.role === 'student') {
      pageModule = studentPages[pageName] || studentPages.schedule;
    } else if (user.role === 'admin') {
      pageModule = adminPages[pageName] || adminPages.users;
    }
    
    if (pageModule && pageModule.default) {
      mainContent.innerHTML = '';
      await pageModule.default(user, mainContent);
    } else {
      mainContent.innerHTML = '<div class="error">Страница не найдена</div>';
    }
  } catch (error) {
    console.error('Error rendering page:', error);
    mainContent.innerHTML = '<div class="error">Ошибка загрузки страницы</div>';
  }
}

// Инициализация
async function initDashboard() {
  await initLayout(null, async (user, mainContent) => {
    await loadPageModules(user.role);
    await renderPage(user, mainContent);
    
    // Обработчик изменения hash для навигации
    window.addEventListener('hashchange', async () => {
      await renderPage(user, mainContent);
    });
  });
}

initDashboard();
