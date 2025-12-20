/**
 * Создает карточку в стиле shadcn
 */
export function createCard(options = {}) {
  const {
    title = '',
    content = '',
    footer = '',
    className = ''
  } = options;
  
  const card = document.createElement('div');
  card.className = `shadcn-card ${className}`;
  
  let html = '';
  if (title) {
    html += `<div class="shadcn-card-header"><h3 class="shadcn-card-title">${title}</h3></div>`;
  }
  html += `<div class="shadcn-card-content">${content}</div>`;
  if (footer) {
    html += `<div class="shadcn-card-footer">${footer}</div>`;
  }
  
  card.innerHTML = html;
  return card;
}

