/**
 * Компонент Form для форм
 */

/**
 * Создать поле формы
 * @param {Object} options - Параметры поля
 * @param {string} options.type - Тип поля (text, email, number, select, textarea, etc.)
 * @param {string} options.name - Имя поля
 * @param {string} options.label - Подпись
 * @param {string} options.placeholder - Placeholder
 * @param {*} options.value - Значение по умолчанию
 * @param {boolean} options.required - Обязательное поле
 * @param {Array} options.options - Опции для select
 * @param {string} options.className - Дополнительные классы
 * @param {Function} options.onChange - Callback при изменении
 * @param {string} options.error - Сообщение об ошибке
 * @returns {HTMLElement} - Элемент поля формы
 */
export function createFormField({
  type = 'text',
  name,
  label,
  placeholder = '',
  value = '',
  required = false,
  options = [],
  className = '',
  onChange,
  error = ''
}) {
  const formGroup = document.createElement('div');
  formGroup.className = `shadcn-form-group ${className}`.trim();
  
  if (error) {
    formGroup.classList.add('error');
  }
  
  // Label
  if (label) {
    const labelEl = document.createElement('label');
    labelEl.className = 'shadcn-label';
    labelEl.setAttribute('for', name);
    labelEl.textContent = label;
    if (required) {
      labelEl.innerHTML += ' <span style="color: var(--shadcn-error)">*</span>';
    }
    formGroup.appendChild(labelEl);
  }
  
  // Input
  let input;
  
  if (type === 'select') {
    input = document.createElement('select');
    input.id = name;
    input.name = name;
    input.className = 'shadcn-input';
    if (required) input.setAttribute('required', '');
    
    if (placeholder) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = placeholder;
      option.disabled = true;
      option.selected = !value;
      input.appendChild(option);
    }
    
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = typeof opt === 'object' ? opt.value : opt;
      option.textContent = typeof opt === 'object' ? opt.label : opt;
      if (option.value === value) {
        option.selected = true;
      }
      input.appendChild(option);
    });
  } else if (type === 'textarea') {
    input = document.createElement('textarea');
    input.id = name;
    input.name = name;
    input.className = 'shadcn-input';
    input.placeholder = placeholder;
    input.value = value;
    if (required) input.setAttribute('required', '');
    input.rows = 4;
  } else {
    input = document.createElement('input');
    input.type = type;
    input.id = name;
    input.name = name;
    input.className = 'shadcn-input';
    input.placeholder = placeholder;
    input.value = value;
    if (required) input.setAttribute('required', '');
  }
  
  if (onChange) {
    input.addEventListener('change', (e) => onChange(e.target.value, e));
    input.addEventListener('input', (e) => onChange(e.target.value, e));
  }
  
  formGroup.appendChild(input);
  
  // Error message
  if (error) {
    const errorEl = document.createElement('div');
    errorEl.className = 'field-error';
    errorEl.textContent = error;
    formGroup.appendChild(errorEl);
  }
  
  return formGroup;
}

/**
 * Валидировать форму
 * @param {HTMLFormElement} form - Форма
 * @returns {Object} - {valid: boolean, errors: Object}
 */
export function validateForm(form) {
  const errors = {};
  let valid = true;
  
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      errors[field.name] = 'Это поле обязательно для заполнения';
      valid = false;
      
      const formGroup = field.closest('.shadcn-form-group');
      if (formGroup) {
        formGroup.classList.add('error');
        let errorEl = formGroup.querySelector('.field-error');
        if (!errorEl) {
          errorEl = document.createElement('div');
          errorEl.className = 'field-error';
          formGroup.appendChild(errorEl);
        }
        errorEl.textContent = errors[field.name];
      }
    } else {
      const formGroup = field.closest('.shadcn-form-group');
      if (formGroup) {
        formGroup.classList.remove('error');
        const errorEl = formGroup.querySelector('.field-error');
        if (errorEl) {
          errorEl.remove();
        }
      }
    }
  });
  
  // Email валидация
  const emailFields = form.querySelectorAll('input[type="email"]');
  emailFields.forEach(field => {
    if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      errors[field.name] = 'Введите корректный email адрес';
      valid = false;
      
      const formGroup = field.closest('.shadcn-form-group');
      if (formGroup) {
        formGroup.classList.add('error');
        let errorEl = formGroup.querySelector('.field-error');
        if (!errorEl) {
          errorEl = document.createElement('div');
          errorEl.className = 'field-error';
          formGroup.appendChild(errorEl);
        }
        errorEl.textContent = errors[field.name];
      }
    }
  });
  
  return { valid, errors };
}

/**
 * Получить данные формы
 * @param {HTMLFormElement} form - Форма
 * @returns {Object} - Данные формы
 */
export function getFormData(form) {
  const formData = new FormData(form);
  const data = {};
  
  for (const [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  return data;
}

