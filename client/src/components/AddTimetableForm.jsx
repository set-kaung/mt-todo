import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import ColorPicker from './ColorPicker.jsx';

const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function AddTimetableForm() {
  const { refreshTimetable } = usePlanner();
  const [name, setName] = useState('');
  const [days, setDays] = useState([]);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:00');
  const [color, setColor] = useState('#c7d2fe');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDate = (value) => {
    setStartDate(value);
    if (endDate && value && endDate < value) {
      setEndDate(value);
    }
  };

  const handleEndDate = (value) => {
    if (value && startDate && value < startDate) return;
    setEndDate(value);
  };

  const toggleDay = (d) => {
    setDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (days.length === 0) return;
    for (const day of days) {
      await api.createTimetable({ name, day, start, end, color, startDate, endDate });
    }
    setName(''); setDays([]); setStart('09:00'); setEnd('10:00'); setColor('#c7d2fe'); setStartDate(''); setEndDate('');
    refreshTimetable();
  };

  return (
    <div>
      <h3>Add Timetable</h3>
      <form className="stacked-form" onSubmit={submit}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Days
          <div className="day-chip-group">
            {DAY_OPTIONS.map((d) => (
              <label key={d} className={`day-chip ${days.includes(d) ? 'selected' : ''}`}>
                <input type="checkbox" checked={days.includes(d)} onChange={() => toggleDay(d)} />
                {d}
              </label>
            ))}
          </div>
        </label>
        <label>Start<input type="time" value={start} onChange={(e) => setStart(e.target.value)} required /></label>
        <label>End<input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required /></label>
        <label>Color<ColorPicker value={color} onChange={setColor} /></label>
        <label>Start Date<input type="date" value={startDate} max={endDate || undefined} onChange={(e) => handleStartDate(e.target.value)} /></label>
        <label>End Date<input type="date" value={endDate} min={startDate || undefined} onChange={(e) => handleEndDate(e.target.value)} /></label>
        <button className="primary-btn" type="submit">ADD</button>
      </form>
    </div>
  );
}
