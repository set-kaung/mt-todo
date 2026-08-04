import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { toISODate, addDays, DAY_CODES } from '../utils/dates.js';

export default function HabitTracker() {
  const { weekMonday } = usePlanner();
  const [data, setData] = useState({ habits: [], completions: {} });
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const weekDates = Array.from({ length: 7 }, (_, i) => toISODate(addDays(weekMonday, i)));

  const load = async () => {
    const d = await api.getHabits();
    setData(d);
  };

  useEffect(() => { load(); }, [weekMonday]);

  const add = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    await api.createHabit({ name: newName });
    setNewName('');
    load();
  };

  const toggle = async (habitId, date) => {
    await api.toggleHabit({ habitId, date });
    load();
  };

  const startEdit = (h) => {
    setEditingId(h.id);
    setEditingName(h.name);
  };

  const saveEdit = async (id) => {
    const name = editingName.trim();
    setEditingId(null);
    setEditingName('');
    if (!name) return;
    await api.renameHabit(id, { name });
    load();
  };

  return (
    <div>
      <h3>Habit Tracker</h3>
      <table className="habit-table">
        <thead>
          <tr>
            <th className="habit-name-col">HABIT</th>
            {DAY_CODES.map((d) => <th key={d}>{d[0]}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.habits.map((h) => (
            <tr key={h.id}>
              <td className="hname">
                {editingId === h.id ? (
                  <input
                    className="habit-name-input"
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveEdit(h.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(h.id);
                      if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                    }}
                    maxLength={24}
                  />
                ) : (
                  <span className="habit-name" title="Double-click to edit" onDoubleClick={() => startEdit(h)}>
                    {h.name}
                  </span>
                )}
              </td>
              {weekDates.map((d) => {
                const key = `${h.id}|${d}`;
                const checked = !!data.completions[key];
                return (
                  <td key={d}>
                    <input type="checkbox" className="habit-check" checked={checked} onChange={() => toggle(h.id, d)} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <form className="inline-form" onSubmit={add}>
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New habit..." maxLength={24} />
        <button className="ghost-btn" type="submit">+</button>
      </form>
    </div>
  );
}
