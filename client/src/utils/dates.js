export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_NAMES = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
export const DAY_CODES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function pad2(n) { return String(n).padStart(2, '0'); }

export function toISODate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function monthKey(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

export function parseISO(s) {
  return new Date(s + 'T00:00:00');
}

export function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

export function addDays(d, n) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}

export function dayCodeFromDate(dateStr) {
  const jsDay = parseISO(dateStr).getDay(); // 0 Sun..6 Sat
  return DAY_CODES[(jsDay + 6) % 7];
}

export function weekDatesFromMonday(mondayStr) {
  const start = new Date(mondayStr + 'T00:00:00');
  const out = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push(d.toISOString().slice(0, 10));
  }
  return out;
}

export function fmtHM(totalMinutes) {
  const m = Math.round(totalMinutes || 0);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${h}:${pad2(mm)}`;
}

export function fmtHr(totalMinutes) {
  const v = (totalMinutes || 0) / 60;
  return (Number.isInteger(v) ? v : v.toFixed(1)) + 'hr';
}

export const PALETTE = ['#f9a8d4', '#fcd9b6', '#a7e8dc', '#c7d2fe', '#d5f5c3', '#fdf1b8', '#f8b4b4', '#b4d4f8'];

export function colorFor(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
