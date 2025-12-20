import { createCard } from '../../dashboard/components/Card.js';
import { createButton } from '../../dashboard/components/Button.js';
import { createTable } from '../../dashboard/components/Table.js';
import { formatDate, formatCurrency, showNotification } from '../../dashboard/utils.js';

export default async function renderPayments(user, container) {
  container.innerHTML = '<div class="loading">Загрузка...</div>';
  
  try {
    const [payments, statistics] = await Promise.all([
      window.apiClient.getPayments(),
      window.apiClient.getPaymentStatistics()
    ]);
    
    const statsCard = createCard({
      title: 'Статистика платежей',
      content: `
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${statistics.totalAmount || 0} ₽</div>
            <div class="stat-label">Всего получено</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${statistics.pendingAmount || 0} ₽</div>
            <div class="stat-label">Ожидает оплаты</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${statistics.completedPayments || 0}</div>
            <div class="stat-label">Оплачено</div>
          </div>
        </div>
      `
    });
    
    const table = createTable({
      headers: ['Ученик', 'Сумма', 'Дата', 'Статус', 'Действия'],
      data: (payments || []).map(payment => [
        payment.student ? `${payment.student.first_name} ${payment.student.last_name}` : '-',
        formatCurrency(payment.amount),
        formatDate(payment.payment_date),
        payment.status,
        createButton('Изменить', { variant: 'outline', size: 'sm' }).outerHTML
      ])
    });
    
    const paymentsCard = createCard({
      title: 'Платежи',
      content: `
        ${createButton('Добавить платеж', {
          onClick: () => showNotification('Добавление платежа в разработке', 'info'),
          icon: 'fas fa-plus'
        }).outerHTML}
        ${table.outerHTML}
      `
    });
    
    container.innerHTML = '';
    container.appendChild(statsCard);
    container.appendChild(paymentsCard);
  } catch (error) {
    console.error('Error loading payments:', error);
    container.innerHTML = '<div class="error">Ошибка загрузки платежей</div>';
  }
}

