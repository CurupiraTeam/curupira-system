export function formatDateTime(value?: string | Date) {
  if (!value) return 'Sem horário';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function formatRelativeUpdate(value?: string | Date) {
  if (!value) return 'Atualização indisponível';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  const diffMinutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 1) return 'Atualizado agora';
  if (diffMinutes < 60) return `Atualizado há ${diffMinutes} min`;
  const hours = Math.round(diffMinutes / 60);
  return `Atualizado há ${hours} h`;
}
