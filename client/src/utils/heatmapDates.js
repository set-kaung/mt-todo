import {
  startOfYear,
  endOfYear,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  addDays,
  format,
  getMonth,
  isSameYear,
} from 'date-fns';

const MONTH_ABBRS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function buildYearGrid(year) {
  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(yearStart);
  const gridStart = startOfWeek(yearStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(yearEnd, { weekStartsOn: 0 });

  const weekStarts = eachWeekOfInterval(
    { start: gridStart, end: gridEnd },
    { weekStartsOn: 0 }
  );

  return weekStarts.map((sunday) =>
    Array.from({ length: 7 }, (_, i) => addDays(sunday, i))
  );
}

export function groupWeeksByMonth(weeks, year) {
  const yearAnchor = new Date(year, 0, 1);
  const groups = Array.from({ length: 12 }, () => []);
  weeks.forEach((week) => {
    const inYearDay = week.find((d) => isSameYear(d, yearAnchor));
    if (!inYearDay) return;
    groups[getMonth(inYearDay)].push(week);
  });
  return groups;
}

export function fmtDate(date) {
  return format(date, 'yyyy-MM-dd');
}
