import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';

export default function SchedulePanel() {
  const { events, refreshEvents } = usePlanner();

  const remove = async (id) => {
    await api.deleteEvent(id);
    refreshEvents();
  };

  return (
    <div className="panel schedule-panel">
      <h3>Schedule</h3>
      <div className="scroll-list">
        {events.length === 0 && <div className="empty-note">No events this month.</div>}
        {events.map((ev) => (
          <div className="schedule-item" key={ev.id}>
            <div className="bar" style={{ background: ev.color }} />
            <div className="body">
              <div className="time">{ev.time || ''} {ev.date.slice(5)}</div>
              <div className="name">{ev.name}</div>
            </div>
            <button className="del" onClick={() => remove(ev.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
