import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { toISODate, addDays, DAY_CODES, MONTH_NAMES } from '../utils/dates.js';
import ConfirmPopup from './ConfirmPopup.jsx';

export default function WeeklyTimetable() {
  const { weekMonday, timetable, refreshTimetable } = usePlanner();
  const [popup, setPopup] = useState({ open: false, slot: null });

  const remove = async () => {
    if (popup.slot) await api.deleteTimetable(popup.slot.id);
    setPopup({ open: false, slot: null });
    refreshTimetable();
  };

  const mon = weekMonday;
  const sun = addDays(mon, 6);
  const label = `${MONTH_NAMES[mon.getMonth()].slice(0, 3)} ${mon.getDate()} – ${MONTH_NAMES[sun.getMonth()].slice(0, 3)} ${sun.getDate()}`;

  const withinRange = (dateISO, start, end) => {
    if (start && dateISO < start) return false;
    if (end && dateISO > end) return false;
    return true;
  };

  return (
    <div className="panel timetable-panel">
      <div className="tt-header">
        <h3>Weekly Timetable</h3>
        <span className="muted">{label}</span>
      </div>
      <div className="timetable-grid">
        {DAY_CODES.map((code, idx) => {
          const dateISO = toISODate(addDays(mon, idx));
          const daySlots = timetable
            .filter((s) => s.day === code && withinRange(dateISO, s.startDate, s.endDate))
            .sort((a, b) => a.start.localeCompare(b.start));
          return (
            <div className="tt-day-col" key={code}>
              <div className="tt-col-header">{code.toUpperCase()}</div>
              {daySlots.length === 0 && <div className="tt-empty" />}
              {daySlots.map((s) => (
                <div className="tt-slot" key={s.id} style={{ background: s.color }} onClick={() => setPopup({ open: true, slot: s })}>
                  <span className="tt-time">{s.start}-{s.end}</span>
                  {s.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <ConfirmPopup open={popup.open} text={`Delete "${popup.slot?.name}"?`} onCancel={() => setPopup({ open: false, slot: null })} onConfirm={remove} />
    </div>
  );
}
