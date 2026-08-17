import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachWeekOfInterval,
  addDays,
} from 'date-fns';
import { fmtDate } from '../utils/heatmapDates.js';
import styles from './MonthHeatmap.module.css';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function levelFor(minutes) {
  if (minutes <= 0) return 0;
  if (minutes <= 25) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 120) return 3;
  return 4;
}

export default function MonthHeatmap({ year, month, minutesByDate, palette }) {
  const start = startOfMonth(new Date(year, month, 1));
  const end = endOfMonth(start);
  const gridStart = startOfWeek(start, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(end, { weekStartsOn: 0 });

  const weekStarts = eachWeekOfInterval(
    { start: gridStart, end: gridEnd },
    { weekStartsOn: 0 }
  );
  const weeks = weekStarts.map((sunday) =>
    Array.from({ length: 7 }, (_, i) => addDays(sunday, i))
  );

  return (
    <div className={styles.month}>
      <div className={styles.title}>{MONTH_NAMES[month]}</div>
      <div className={styles.weeks}>
        {weeks.map((week, w) => (
          <div className={styles.week} key={w}>
            {week.map((date) => {
              const iso = fmtDate(date);
              const inMonth = date.getMonth() === month && date.getFullYear() === year;
              const mins = inMonth ? (minutesByDate[iso] || 0) : 0;
              const lvl = levelFor(mins);
              return (
                <div
                  key={iso}
                  className={`${styles.cell}${inMonth ? '' : ` ${styles.out}`}`}
                  style={inMonth ? { background: palette[lvl] } : undefined}
                  title={inMonth ? `${iso} — ${mins}m` : ''}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
