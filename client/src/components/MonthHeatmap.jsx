import { fmtDate } from '../utils/heatmapDates.js';
import styles from './MonthHeatmap.module.css';

const MONTH_ABBRS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function levelFor(minutes) {
  if (minutes <= 0) return 0;
  if (minutes <= 25) return 1;
  if (minutes <= 60) return 2;
  if (minutes <= 120) return 3;
  return 4;
}

export default function MonthHeatmap({ year, month, weeks, minutesByDate, palette }) {
  return (
    <div className={styles.month} style={{ flexGrow: weeks.length, flexBasis: 0 }}>
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

export { MONTH_ABBRS };
