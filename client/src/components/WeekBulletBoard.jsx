import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { toISODate, addDays, DAY_CODES } from '../utils/dates.js';

const FIXED_BULLETS = 6;

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
            {Array.from({ length: FIXED_BULLETS }).map((_, idx) => {
              const item = info.items[idx] || { text: '', done: false };
              return (
                <div className="bullet-row" key={idx}>
                  <input type="checkbox" checked={item.done} onChange={() => toggle(info.date, idx)} />
                  <input
                    type="text"
                    value={item.text}
                    placeholder="..."
                    className={item.done ? 'done' : ''}
                    onChange={(e) => {
                      const next = { ...data };
                      next[code].items[idx].text = e.target.value;
                      setData(next);
                    }}
                    onBlur={(e) => updateText(info.date, idx, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}
