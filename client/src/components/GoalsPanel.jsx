import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { monthKey } from '../utils/dates.js';
import FocusBreakdown from './FocusBreakdown.jsx';

export default function GoalsPanel() {
  const { calMonth, allFocus } = usePlanner();
  const [goals, setGoals] = useState(['', '', '']);

  const load = async () => {
    const data = await api.getGoals(monthKey(calMonth));
    setGoals(data.slice(0, 3));
  };

  useEffect(() => { load(); }, [calMonth]);

  const update = async (idx, value) => {
    const next = [...goals];
    next[idx] = value;
    setGoals(next);
    await api.setGoals({ month: monthKey(calMonth), goals: next });
  };

  const sessions = allFocus.filter((s) => s.type === 'focus' && s.date.startsWith(monthKey(calMonth)));

  return (
    <div className="panel goals-panel">
      <h3>Monthly Goals</h3>
      <div className="goals-list">
        {goals.map((g, i) => (
          <input key={i} value={g} placeholder={`Goal ${i + 1}`} onChange={(e) => update(i, e.target.value)} />
        ))}
      </div>
      <FocusBreakdown sessions={sessions} fmtValue={(m) => `${(m / 60).toFixed(1)}hr`} />
    </div>
  );
}
