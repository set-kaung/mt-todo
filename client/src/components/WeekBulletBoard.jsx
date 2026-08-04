import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { toISODate, addDays, DAY_CODES } from '../utils/dates.js';

export default function WeekBulletBoard() {
  const { weekMonday } = usePlanner();
  const [data, setData] = useState({});

  const load = async () => {
    const d = await api.getWeeklyTasks(toISODate(weekMonday));
    setData(d);
  };

  useEffect(() => { load(); }, [weekMonday]);

  const updateText = async (date, index, text) => {
    await api.updateWeeklyTask({ date, index, text });
    load();
  };

  const toggle = async (date, index) => {
    await api.toggleWeeklyTask({ date, index });
    load();
  };

  return (
    <section className="row row3">
      {DAY_CODES.map((code) => {
        const info = data[code] || { date: toISODate(addDays(weekMonday, DAY_CODES.indexOf(code))), items: [] };
        const d = new Date(info.date + 'T00:00:00');
        return (
          <div className="day-col" key={code}>
            <div className="day-head">
              <span>{code.toUpperCase()}</span>
              <span className="dnum">{d.getDate()}</span>
            </div>
            {info.items.length === 0 && <div className="empty-note">No bullets.</div>}
            {info.items.map((item) => (
              <div className="bullet-row" key={item.index}>
                <input type="checkbox" checked={item.done} onChange={() => toggle(info.date, item.index)} />
                <input
                  type="text"
                  value={item.text}
                  placeholder="..."
                  className={item.done ? 'done' : ''}
                  onChange={(e) => {
                    const next = { ...data };
                    next[code] = { ...next[code], items: next[code].items.map((i) => (i.index === item.index ? { ...i, text: e.target.value } : i)) };
                    setData(next);
                  }}
                  onBlur={(e) => updateText(info.date, item.index, e.target.value)}
                />
              </div>
            ))}
            <button className="pill-btn" onClick={async () => {
              const nextIndex = info.items.length ? Math.max(...info.items.map((i) => i.index)) + 1 : 0;
              await api.updateWeeklyTask({ date: info.date, index: nextIndex, text: '' });
              load();
            }}>+</button>
          </div>
        );
      })}
    </section>
  );
}
