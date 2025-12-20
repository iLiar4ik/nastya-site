/**
 * Создает кнопку в стиле shadcn
 */
export function createButton(text, options = {}) {
  const {
    variant = 'default',
    size = 'default',
    icon = null,
    onClick = null,
    className = '',
    disabled = false,
    type = 'button'
  } = options;
  
  const button = document.createElement('button');
  button.type = type;
  button.className = `shadcn-button shadcn-button-variant-${variant} shadcn-button-size-${size} ${className}`;
  button.disabled = disabled;
  
  if (icon) {
    button.innerHTML = `<i class="${icon}"></i> ${text}`;
  } else {
    button.textContent = text;
  }
  
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  
  return button;
}

