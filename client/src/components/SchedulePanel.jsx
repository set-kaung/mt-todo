import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';

const eventDateTime = (ev) => {
  const t = ev.time ? ev.time.padStart(5, '0') : '00:00';
  return new Date(`${ev.date}T${t}`);
};

export default function SchedulePanel() {
  const { events, refreshEvents } = usePlanner();

  const remove = async (id) => {
    await api.deleteEvent(id);
    refreshEvents();
  };

  const now = new Date();
  const sorted = [...events].sort((a, b) => {
    const pa = eventDateTime(a) < now;
    const pb = eventDateTime(b) < now;
    if (pa !== pb) return pa ? 1 : -1;
    return eventDateTime(a) - eventDateTime(b);
  });

  return (
    <div className="panel schedule-panel">
      <h3>Schedule</h3>
      <div className="scroll-list">
        {events.length === 0 && <div className="empty-note">No events this month.</div>}
        {sorted.map((ev) => {
          const past = eventDateTime(ev) < now;
          return (
            <div className="schedule-item" key={ev.id}>
              <div className="bar" style={{ background: ev.color }} />
              <div className="body">
                <div className="time" style={past ? { textDecoration: 'line-through', opacity: 0.5 } : undefined}>{ev.date.slice(8)}-{ev.date.slice(5, 7)} {ev.time || ''}</div>
                <div className="name" style={past ? { textDecoration: 'line-through', opacity: 0.5 } : undefined}>{ev.name}</div>
              </div>
              <button className="del" onClick={() => remove(ev.id)}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
