import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { toISODate, addDays, monthKey, MONTH_NAMES, DAY_NAMES } from '../utils/dates.js';
import Modal from './Modal.jsx';
import ColorPicker from './ColorPicker.jsx';

export default function CalendarPanel() {
  const { today, calMonth, setCalMonth } = usePlanner();
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [prefillDate, setPrefillDate] = useState(toISODate(today));

  const load = async () => {
    const data = await api.getEvents(monthKey(calMonth));
    setEvents(data);
  };

  useEffect(() => { load(); }, [calMonth]);

  const firstOfMonth = new Date(calMonth.getFullYear(), calMonth.getMonth(), 1);
  const gridStart = addDays(firstOfMonth, -firstOfMonth.getDay());
  const todayISO = toISODate(today);
  const eventsByDate = {};
  events.forEach((e) => { (eventsByDate[e.date] = eventsByDate[e.date] || []).push(e); });

  const shiftMonth = (n) => {
    setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + n, 1));
  };

  const openModal = (date) => {
    setPrefillDate(date);
    setModalOpen(true);
  };

  return (
    <div className="panel calendar-panel">
      <div className="cal-header">
        <button className="ghost-btn" onClick={() => shiftMonth(-1)}>‹</button>
        <h2>
          {MONTH_NAMES[calMonth.getMonth()][0] + MONTH_NAMES[calMonth.getMonth()].slice(1).toLowerCase()} {calMonth.getFullYear()}
        </h2>
        <button className="ghost-btn" onClick={() => shiftMonth(1)}>›</button>
        <button className="primary-btn" onClick={() => openModal(todayISO)}>+ Add</button>
      </div>
      <div className="cal-weekdays">
        {DAY_NAMES.map((d) => <span key={d}>{d.toUpperCase()}</span>)}
      </div>
      <div className="calendar-grid">
        {Array.from({ length: 42 }).map((_, i) => {
          const d = addDays(gridStart, i);
          const iso = toISODate(d);
          const classes = ['cal-cell', d.getMonth() !== calMonth.getMonth() ? 'other-month' : '', iso === todayISO ? 'is-today' : '']
            .filter(Boolean).join(' ');
          return (
            <div className={classes} key={iso} onClick={() => openModal(iso)}>
              <div className="date-num">{d.getDate()}</div>
                {(eventsByDate[iso] || []).map((ev) => (
                  <div className="cal-event" key={ev.id} style={{ background: ev.color }} title={`${ev.name} ${ev.time || ''}`} onClick={(e) => { e.stopPropagation(); remove(ev.id); }}>
                    {ev.name}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
      <EventModal open={modalOpen} onClose={() => { setModalOpen(false); load(); }} prefillDate={prefillDate} />
    </div>
  );
}

function EventModal({ open, onClose, prefillDate }) {
  const { today } = usePlanner();
  const [name, setName] = useState('');
  const [date, setDate] = useState(prefillDate);
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('2');
  const [color, setColor] = useState('#f9a8d4');

  useEffect(() => { setDate(prefillDate); }, [prefillDate]);

  const submit = async (e) => {
    e.preventDefault();
    await api.createEvent({ name, date, time, priority, color });
    setName(''); setTime(''); setPriority('2'); setColor('#f9a8d4');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Event">
      <form className="stacked-form" onSubmit={submit}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
        <label>Time<input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></label>
        <label>Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="1">High</option>
            <option value="2">Medium</option>
            <option value="3">Low</option>
          </select>
        </label>
        <label>Color<ColorPicker value={color} onChange={setColor} /></label>
        <div className="modal-actions">
          <button type="button" className="ghost-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-btn">Save</button>
        </div>
      </form>
    </Modal>
  );
}
