import { useEffect, useState, useRef } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import { toISODate, addDays, parseISO, MONTH_NAMES, DAY_CODES, colorFor } from '../utils/dates.js';

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6);

export default function DailyTimetable() {
  const { today, selectedDate, setSelectedDate, weekMonday, allFocus } = usePlanner();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const isToday = selectedDate === toISODate(today);
  const d = parseISO(selectedDate);

  return (
    <div className="panel daily-timetable-panel">
      <div className="date-controls" ref={wrapRef}>
        <button className={`pill-btn ${isToday ? 'active' : ''}`} onClick={() => setSelectedDate(toISODate(today))}>TODAY</button>
        <div className="select-date-wrap">
          <button className="pill-btn" onClick={() => setDropdownOpen((v) => !v)}>SELECT DATE</button>
          <div className={`dropdown ${dropdownOpen ? '' : 'hidden'}`}>
            {DAY_CODES.map((code, idx) => {
              const dateISO = toISODate(addDays(weekMonday, idx));
              if (dateISO === toISODate(today)) return null;
              return <button key={dateISO} onClick={() => { setSelectedDate(dateISO); setDropdownOpen(false); }}>{code} {parseISO(dateISO).getDate()}</button>;
            })}
          </div>
        </div>
      </div>
      <div className="daily-date-label">
        <span className="daily-day">{String(d.getDate()).padStart(2, '0')}</span>
        <span className="daily-month-year">{MONTH_NAMES[d.getMonth()]} {d.getFullYear()}</span>
      </div>
      <div className="daily-timetable">
        {HOURS.map((h) => {
          const label = h === 12 ? '12 PM' : h > 12 ? `${h - 12} PM` : `${h} AM`;
          const hourFocus = allFocus.filter((s) => s.date === selectedDate && s.type === 'focus' && s.start_time && parseInt(s.start_time.split(':')[0], 10) === h);
          return (
            <div className="dt-hour-row" key={h}>
              <div className="dt-hour-label">{label}</div>
              <div className="dt-hour-content">
                {hourFocus.map((s) => (
                  <div className="dt-entry" key={s.id} style={{ background: colorFor(s.category) }}>
                    <span>{s.category} ({s.minutes} mins)</span><span>{s.start_time}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
