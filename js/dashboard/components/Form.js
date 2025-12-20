/**
 * Создает поле формы в стиле shadcn
 */
export function createFormField(options = {}) {
  const {
    label = '',
    name = '',
    type = 'text',
    value = '',
    placeholder = '',
    required = false,
    error = '',
    selectOptions = [],
    textareaRows = 3,
    className = ''
  } = options;
  
  const fieldGroup = document.createElement('div');
  fieldGroup.className = `form-group ${className}`;
  if (error) fieldGroup.classList.add('error');
  
  let html = '';
  if (label) {
    html += `<label class="form-label" for="${name}">${label}${required ? ' <span class="required">*</span>' : ''}</label>`;
  }
  
  if (type === 'select') {
    html += `<select class="shadcn-input" id="${name}" name="${name}" ${required ? 'required' : ''}>`;
    if (placeholder) {
      html += `<option value="">${placeholder}</option>`;
    }
    selectOptions.forEach(option => {
      const optValue = typeof option === 'object' ? option.value : option;
      const optLabel = typeof option === 'object' ? option.label : option;
      const selected = optValue === value ? 'selected' : '';
      html += `<option value="${optValue}" ${selected}>${optLabel}</option>`;
    });
    html += '</select>';
  } else if (type === 'textarea') {
    html += `<textarea class="shadcn-input" id="${name}" name="${name}" rows="${textareaRows}" placeholder="${placeholder}" ${required ? 'required' : ''}>${value}</textarea>`;
  } else if (type === 'file') {
    html += `<input type="file" class="shadcn-input" id="${name}" name="${name}" ${required ? 'required' : ''} />`;
  } else {
    html += `<input type="${type}" class="shadcn-input" id="${name}" name="${name}" value="${value}" placeholder="${placeholder}" ${required ? 'required' : ''} />`;
  }
  
  if (error) {
    html += `<span class="error-message">${error}</span>`;
  }
  
  fieldGroup.innerHTML = html;
  return fieldGroup;
}

/**
 * Создает форму
 */
export function createForm(options = {}) {
  const {
    fields = [],
    onSubmit = null,
    submitText = 'Сохранить',
    className = ''
  } = options;
  
  const form = document.createElement('form');
  form.className = `shadcn-form ${className}`;
  
  fields.forEach(field => {
    const fieldElement = createFormField(field);
    form.appendChild(fieldElement);
  });
  
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'shadcn-button shadcn-button-variant-default';
  submitBtn.textContent = submitText;
  form.appendChild(submitBtn);
  
  if (onSubmit) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      onSubmit(data);
    });
  }
  
  return form;
}
