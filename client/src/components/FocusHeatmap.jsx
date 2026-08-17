import { usePlanner } from '../context/PlannerContext.jsx';
import { fmtHr } from '../utils/dates.js';
import MonthHeatmap from './MonthHeatmap.jsx';
import styles from './FocusHeatmap.module.css';

const PALETTE = ['#ececec', '#fde6f0', '#f9b9d7', '#f599c6', '#e06a9f'];

const CELL = 15;
const GAP = 4;
const DAY_LABELS_W = 24;
const BODY_GAP = 3;

const ROOT_VARS = {
  '--cell': `${CELL}px`,
  '--gap': `${GAP}px`,
  '--day-labels-w': `${DAY_LABELS_W}px`,
  '--body-gap': `${BODY_GAP}px`,
};

export default function FocusHeatmap() {
  const { allFocus, calMonth } = usePlanner();

  const minutesByDate = {};
  allFocus
    .filter((s) => s.type === 'focus')
    .forEach((s) => {
      minutesByDate[s.date] = (minutesByDate[s.date] || 0) + s.minutes;
    });

  const year = calMonth.getFullYear();
  const yearMinutes = Object.entries(minutesByDate)
    .filter(([d]) => d.startsWith(`${year}-`))
    .reduce((a, [, m]) => a + m, 0);

  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={`panel ${styles.panel}`} style={ROOT_VARS}>
      <div className={styles.header}>
        <h3>Focus Activity — {year}</h3>
        <span className="muted small">{fmtHr(yearMinutes)} total</span>
      </div>
      <div className={styles.scroll}>
        <div className={styles.monthsBody}>
          <div className={styles.dayLabels}>
            {dayLabels.map((d, i) => (
              <span key={i} className={styles.dayLabel}>{d}</span>
            ))}
          </div>
          <div className={styles.months}>
            {Array.from({ length: 12 }, (_, m) => (
              <MonthHeatmap
                key={m}
                year={year}
                month={m}
                minutesByDate={minutesByDate}
                palette={PALETTE}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.legendBar}>
        <span className="muted small">Less</span>
        {PALETTE.map((c, i) => (
          <span key={i} className={`${styles.cell} ${styles.legendSize}`} style={{ background: c }} />
        ))}
        <span className="muted small">More</span>
      </div>
    </div>
  );
}
