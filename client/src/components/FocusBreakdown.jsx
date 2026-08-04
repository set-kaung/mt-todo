import { fmtHM, colorFor } from '../utils/dates.js';

export default function FocusBreakdown({ sessions, fmtValue = (m) => `${Math.round(m)}m` }) {
  const by = {};
  sessions.forEach((s) => { by[s.category] = (by[s.category] || 0) + s.minutes; });
  const entries = Object.entries(by).sort((a, b) => b[1] - a[1]);
  const max = entries.length ? entries[0][1] : 1;
  const total = sessions.reduce((a, s) => a + s.minutes, 0);

  return (
    <div className="kpi-block">
      <div className="kpi-time">{fmtHM(total)}</div>
      <div className="kpi-label">Focused</div>
      <div className="kpi-sub">FOCUS HOURS BREAKDOWN</div>
      <div className="focus-breakdown">
        {entries.length === 0 && <div className="empty-note">No focus sessions yet.</div>}
        {entries.map(([cat, mins]) => (
          <div className="fb-row" key={cat}>
            <span className="fb-label">{cat}</span>
            <span className="fb-bar-track">
              <span className="fb-bar-fill" style={{ width: `${(mins / max * 100).toFixed(0)}%`, background: colorFor(cat) }} />
            </span>
            <span className="fb-val">{fmtValue(mins)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
