import { usePlanner } from '../context/PlannerContext.jsx';
import { toISODate, addDays, fmtHM } from '../utils/dates.js';
import FocusBreakdown from './FocusBreakdown.jsx';

export default function DailyFocusKPI() {
  const { selectedDate, allFocus } = usePlanner();
  const sessions = allFocus.filter((s) => s.type === 'focus' && s.date === selectedDate);
  return <FocusBreakdown sessions={sessions} fmtValue={(m) => fmtHM(m)} />;
}

export function WeeklyFocusKPI() {
  const { weekMonday, allFocus } = usePlanner();
  const dates = Array.from({ length: 7 }, (_, i) => toISODate(addDays(weekMonday, i)));
  const sessions = allFocus.filter((s) => s.type === 'focus' && dates.includes(s.date));
  return <FocusBreakdown sessions={sessions} fmtValue={(m) => `${(m / 60).toFixed(1)}hr`} />;
}
