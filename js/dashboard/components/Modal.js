/**
 * Создает модальное окно в стиле shadcn
 */
export function createModal(options = {}) {
  const {
    title = '',
    content = '',
    footer = '',
    onClose = null,
    className = ''
  } = options;
  
  const overlay = document.createElement('div');
  overlay.className = 'shadcn-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = `shadcn-modal ${className}`;
  
  let html = '';
  if (title) {
    html += `<div class="shadcn-modal-header">
      <h2 class="shadcn-modal-title">${title}</h2>
      <button class="shadcn-modal-close" aria-label="Close">&times;</button>
    </div>`;
  }
  html += `<div class="shadcn-modal-content">${content}</div>`;
  if (footer) {
    html += `<div class="shadcn-modal-footer">${footer}</div>`;
  }
  
  modal.innerHTML = html;
  overlay.appendChild(modal);
  
  // Обработчик закрытия
  const closeBtn = modal.querySelector('.shadcn-modal-close');
  const closeModal = () => {
    overlay.classList.remove('active');
    if (onClose) onClose();
    setTimeout(() => overlay.remove(), 300);
  };
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });
  
  // Показываем модальное окно
  setTimeout(() => overlay.classList.add('active'), 10);
  
  return overlay;
}

/**
 * Закрыть модальное окно
 */
export function closeModal(modalElement) {
  if (modalElement) {
    modalElement.classList.remove('active');
    setTimeout(() => modalElement.remove(), 300);
  }
}
