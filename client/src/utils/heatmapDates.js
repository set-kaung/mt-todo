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

export function getMonthLabels(weeks, year) {
  const labels = [];
  const yearAnchor = new Date(year, 0, 1);

  for (let month = 0; month < 12; month++) {
    const firstWeekIndex = weeks.findIndex((week) =>
      week.some((d) => isSameYear(d, yearAnchor) && getMonth(d) === month)
    );
    if (firstWeekIndex !== -1) {
      labels.push({ weekIndex: firstWeekIndex, label: MONTH_ABBRS[month] });
    }
  }

  return labels;
}

export function fmtDate(date) {
  return format(date, 'yyyy-MM-dd');
}
