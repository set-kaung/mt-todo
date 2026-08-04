import { usePlanner } from '../context/PlannerContext.jsx';
import { toISODate, addDays, getMonday, MONTH_NAMES } from '../utils/dates.js';

const DOWS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function MiniCalendar() {
  const { today, weekMonday, setWeekMonday, miniCalMonth, setMiniCalMonth } = usePlanner();

  const firstOfMonth = new Date(miniCalMonth.getFullYear(), miniCalMonth.getMonth(), 1);
  const gridStart = getMonday(firstOfMonth);
  const todayISO = toISODate(today);
  const weekStartISO = toISODate(weekMonday);
  const weekEndISO = toISODate(addDays(weekMonday, 6));

  const days = Array.from({ length: 42 }, (_, i) => {
    const d = addDays(gridStart, i);
    const iso = toISODate(d);
    let cls = 'mc-day';
    if (d.getMonth() !== miniCalMonth.getMonth()) cls += ' other';
    if (iso >= weekStartISO && iso <= weekEndISO) cls += ' this-week';
    if (iso === todayISO) cls += ' today';
    return { date: d, iso, cls };
  });

  return (
    <div className="mini-cal-wrap">
      <div className="mini-cal-header">
        <button className="ghost-btn" onClick={() => setMiniCalMonth(new Date(miniCalMonth.getFullYear(), miniCalMonth.getMonth() - 1, 1))}>‹</button>
        <span>{MONTH_NAMES[miniCalMonth.getMonth()][0] + MONTH_NAMES[miniCalMonth.getMonth()].slice(1).toLowerCase()} {miniCalMonth.getFullYear()}</span>
        <button className="ghost-btn" onClick={() => setMiniCalMonth(new Date(miniCalMonth.getFullYear(), miniCalMonth.getMonth() + 1, 1))}>›</button>
      </div>
      <div className="mini-cal">
        {DOWS.map((d) => <div className="mc-dow" key={d}>{d}</div>)}
        {days.map(({ date, iso, cls }) => (
          <div className={cls} key={iso} onClick={() => setWeekMonday(getMonday(date))}>
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
