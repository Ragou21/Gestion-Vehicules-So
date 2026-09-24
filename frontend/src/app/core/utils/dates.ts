export function toDateTimeLocal(value?: string | null): string {
  if (!value) {
    return '';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value.slice(0, 16);
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toApiDateTime(value: string): string {
  if (!value) {
    return value;
  }
  return value.length === 16 ? `${value}:00` : value;
}

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return '—';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function remainingEditMs(from?: string | null, windowMs = 5 * 60 * 1000): number {
  if (!from) {
    return 0;
  }
  const start = new Date(from).getTime();
  if (Number.isNaN(start)) {
    return 0;
  }
  return Math.max(0, start + windowMs - Date.now());
}
