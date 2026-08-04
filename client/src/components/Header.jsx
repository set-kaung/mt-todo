import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import { toISODate, addDays, MONTH_NAMES, getMonday } from '../utils/dates.js';

export default function Header() {
  const { today, weekMonday, setWeekMonday } = usePlanner();

  const shift = (n) => {
    setWeekMonday(addDays(weekMonday, n * 7));
  };

  const mon = weekMonday;
  const sun = addDays(mon, 6);
  const weekLabel = `Week of ${MONTH_NAMES[mon.getMonth()].slice(0, 3)} ${mon.getDate()} – ${MONTH_NAMES[sun.getMonth()].slice(0, 3)} ${sun.getDate()}`;

  return (
    <header className="app-header">
      <div className="today-badge">
        <span className="today-day">{String(today.getDate()).padStart(2, '0')}</span>
        <span className="today-month-year">{MONTH_NAMES[today.getMonth()]} {today.getFullYear()}</span>
      </div>
      <div className="week-nav">
        <button className="ghost-btn" onClick={() => shift(-1)}>‹ Week</button>
        <span>{weekLabel}</span>
        <button className="ghost-btn" onClick={() => shift(1)}>Week ›</button>
      </div>
    </header>
  );
}
