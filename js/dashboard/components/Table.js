/**
 * Компонент Table для таблиц
 */

/**
 * Создать таблицу
 * @param {Object} options - Параметры таблицы
 * @param {Array} options.columns - Колонки [{key, label, render?}]
 * @param {Array} options.data - Данные
 * @param {Function} options.onRowClick - Callback при клике на строку
 * @param {string} options.className - Дополнительные классы
 * @returns {HTMLElement} - Элемент таблицы
 */
export function createTable({ columns, data, onRowClick, className = '' }) {
  const table = document.createElement('table');
  table.className = `students-table ${className}`.trim();
  
  // Заголовок
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  columns.forEach(column => {
    const th = document.createElement('th');
    th.textContent = column.label || column.key;
    if (column.sortable) {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        // TODO: Реализовать сортировку
      });
    }
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Тело таблицы
  const tbody = document.createElement('tbody');
  
  if (data && data.length > 0) {
    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      if (onRowClick) {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => onRowClick(row, index));
      }
      
      columns.forEach(column => {
        const td = document.createElement('td');
        
        if (column.render && typeof column.render === 'function') {
          td.innerHTML = column.render(row[column.key], row, index);
        } else {
          td.textContent = row[column.key] || '';
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  } else {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = columns.length;
    td.className = 'empty-state';
    td.textContent = 'Нет данных';
    td.style.textAlign = 'center';
    td.style.padding = '40px';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
  
  table.appendChild(tbody);
  return table;
}

/**
 * Обновить данные таблицы
 * @param {HTMLElement} table - Элемент таблицы
 * @param {Array} data - Новые данные
 * @param {Array} columns - Колонки
 * @param {Function} onRowClick - Callback при клике на строку
 */
export function updateTable(table, data, columns, onRowClick) {
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (data && data.length > 0) {
    data.forEach((row, index) => {
      const tr = document.createElement('tr');
      if (onRowClick) {
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => onRowClick(row, index));
      }
      
      columns.forEach(column => {
        const td = document.createElement('td');
        
        if (column.render && typeof column.render === 'function') {
          td.innerHTML = column.render(row[column.key], row, index);
        } else {
          td.textContent = row[column.key] || '';
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  } else {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = columns.length;
    td.className = 'empty-state';
    td.textContent = 'Нет данных';
    td.style.textAlign = 'center';
    td.style.padding = '40px';
    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

