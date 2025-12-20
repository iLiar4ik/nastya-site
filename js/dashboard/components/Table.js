/**
 * Создает таблицу в стиле shadcn
 */
export function createTable(options = {}) {
  const {
    headers = [],
    data = [],
    className = '',
    onRowClick = null
  } = options;
  
  const table = document.createElement('div');
  table.className = `shadcn-table-wrapper ${className}`;
  
  let html = '<table class="shadcn-table"><thead><tr>';
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  data.forEach((row, index) => {
    html += '<tr>';
    row.forEach(cell => {
      html += `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  table.innerHTML = html;
  
  if (onRowClick) {
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => onRowClick(data[index], index));
    });
  }
  
  return table;
}
