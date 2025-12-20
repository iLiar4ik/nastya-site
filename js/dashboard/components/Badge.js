/**
 * Создает бейдж в стиле shadcn
 */
export function createBadge(text, variant = 'default') {
  const badge = document.createElement('span');
  badge.className = `shadcn-badge shadcn-badge-variant-${variant}`;
  badge.textContent = text;
  return badge;
}

