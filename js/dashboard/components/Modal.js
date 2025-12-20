/**
 * Компонент Modal для модальных окон
 */

/**
 * Создать модальное окно
 * @param {Object} options - Параметры модального окна
 * @param {string} options.title - Заголовок
 * @param {string|HTMLElement} options.content - Содержимое
 * @param {Array} options.buttons - Кнопки (опционально)
 * @param {Function} options.onClose - Callback при закрытии
 * @param {string} options.size - Размер (sm, md, lg, xl)
 * @returns {HTMLElement} - Элемент модального окна
 */
export function createModal({ title, content, buttons = [], onClose, size = 'md' }) {
  // Создаем overlay
  const overlay = document.createElement('div');
  overlay.className = 'shadcn-modal-overlay';
  overlay.id = `modal-${Date.now()}`;
  
  // Создаем модальное окно
  const modal = document.createElement('div');
  modal.className = `shadcn-modal shadcn-modal-${size}`;
  
  // Заголовок
  const header = document.createElement('div');
  header.className = 'shadcn-modal-header';
  
  const titleEl = document.createElement('h2');
  titleEl.className = 'shadcn-modal-title';
  titleEl.textContent = title;
  header.appendChild(titleEl);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'shadcn-modal-close';
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.setAttribute('aria-label', 'Закрыть');
  closeBtn.addEventListener('click', () => closeModal(overlay, onClose));
  header.appendChild(closeBtn);
  
  modal.appendChild(header);
  
  // Содержимое
  const contentEl = document.createElement('div');
  contentEl.className = 'shadcn-modal-content';
  if (typeof content === 'string') {
    contentEl.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    contentEl.appendChild(content);
  }
  modal.appendChild(contentEl);
  
  // Футер с кнопками
  if (buttons.length > 0) {
    const footer = document.createElement('div');
    footer.className = 'shadcn-modal-footer';
    
    buttons.forEach(button => {
      const btn = document.createElement('button');
      btn.className = `shadcn-btn ${button.className || 'shadcn-btn-primary'}`;
      btn.textContent = button.label;
      if (button.onClick) {
        btn.addEventListener('click', () => {
          button.onClick();
          if (button.closeOnClick !== false) {
            closeModal(overlay, onClose);
          }
        });
      }
      footer.appendChild(btn);
    });
    
    modal.appendChild(footer);
  }
  
  overlay.appendChild(modal);
  
  // Закрытие по клику на overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay, onClose);
    }
  });
  
  // Закрытие по Escape
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(overlay, onClose);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Добавляем в DOM
  document.body.appendChild(overlay);
  
  // Анимация появления
  setTimeout(() => {
    overlay.classList.add('active');
  }, 10);
  
  return overlay;
}

/**
 * Закрыть модальное окно
 * @param {HTMLElement} overlay - Overlay модального окна
 * @param {Function} onClose - Callback при закрытии
 */
function closeModal(overlay, onClose) {
  overlay.classList.remove('active');
  setTimeout(() => {
    overlay.remove();
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, 300);
}

/**
 * Закрыть все модальные окна
 */
export function closeAllModals() {
  const modals = document.querySelectorAll('.shadcn-modal-overlay');
  modals.forEach(modal => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
  });
}

