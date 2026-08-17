import { usePlanner } from '../context/PlannerContext.jsx';
import { fmtHr } from '../utils/dates.js';
import { buildYearGrid, groupWeeksByMonth } from '../utils/heatmapDates.js';
import MonthHeatmap, { MONTH_ABBRS } from './MonthHeatmap.jsx';
import styles from './FocusHeatmap.module.css';

const PALETTE = ['#ececec', '#fde6f0', '#f9b9d7', '#f599c6', '#e06a9f'];
const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function FocusHeatmap() {
  const { allFocus, calMonth } = usePlanner();

  const minutesByDate = {};
  allFocus
    .filter((s) => s.type === 'focus')
    .forEach((s) => {
      minutesByDate[s.date] = (minutesByDate[s.date] || 0) + s.minutes;
    });

  const year = calMonth.getFullYear();
  const yearWeeks = buildYearGrid(year);
  const monthGroups = groupWeeksByMonth(yearWeeks, year);
  const totalWeeks = yearWeeks.length;

  const yearMinutes = Object.entries(minutesByDate)
    .filter(([d]) => d.startsWith(`${year}-`))
    .reduce((a, [, m]) => a + m, 0);

  return (
    <div className={`panel ${styles.panel}`}>
      <div className={styles.header}>
        <h3>Focus Activity — {year}</h3>
        <span className="muted small">{fmtHr(yearMinutes)} total</span>
      </div>
      <div className={styles.body}>
        <div className={styles.labelsRow}>
          <div className={styles.spacer} style={{ flexGrow: 1, flexBasis: 0 }} />
          <div className={styles.labelsFlex} style={{ flexGrow: totalWeeks, flexBasis: 0 }}>
            {monthGroups.map((weeks, m) => (
              <div
                key={m}
                className={styles.monthLabel}
                style={{ flexGrow: weeks.length, flexBasis: 0 }}
              >
                {MONTH_ABBRS[m]}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.weeksRow}>
          <div className={styles.dayLabelsCol} style={{ flexGrow: 1, flexBasis: 0 }}>
            {DAY_LABELS.map((d, i) => (
              <span key={i} className={styles.dayLabelCell}>{d}</span>
            ))}
          </div>
          <div className={styles.monthsFlex} style={{ flexGrow: totalWeeks, flexBasis: 0 }}>
            {monthGroups.map((weeks, m) => (
              <MonthHeatmap
                key={m}
                year={year}
                month={m}
                weeks={weeks}
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
