import { useEffect, useRef, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';
import { pad2 } from '../utils/dates.js';

const RING_CIRC = 2 * Math.PI * 52;

export default function PomodoroTimer() {
  const { selectedDate, refreshFocus } = usePlanner();
  const [mode, setMode] = useState('focus');
  const [minutes, setMinutes] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [category, setCategory] = useState('');
  const startedAt = useRef(null);
  const intervalRef = useRef(null);
  const totalRef = useRef(25 * 60);
  const dingRef = useRef(null);

  const playDing = () => {
    const audio = dingRef.current ??= new Audio('/ding.mp3');
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const reset = (nextMode = mode, nextMinutes = minutes) => {
    const total = nextMinutes * 60;
    totalRef.current = total;
    setRemaining(total);
    setRunning(false);
    startedAt.current = null;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const setModeSafe = (m) => {
    if (running) return;
    setMode(m);
    const defaultMin = m === 'focus' ? 25 : 5;
    setMinutes(defaultMin);
    reset(m, defaultMin);
  };

  const updateMinutes = (v) => {
    if (running) return;
    const clamped = Math.max(1, Math.min(180, parseInt(v, 10) || 25));
    setMinutes(clamped);
    reset(mode, clamped);
  };

  const startPause = () => {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      if (!startedAt.current) startedAt.current = new Date();
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            playDing();
            saveSession(totalRef.current, 0);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
  };

  const saveSession = async (totalSeconds, currentRemaining) => {
    clearInterval(intervalRef.current);
    const elapsedSeconds = totalSeconds - currentRemaining;
    const elapsedMinutes = Math.round(elapsedSeconds / 60);
    const started = startedAt.current || new Date();
    const now = new Date();
    setRunning(false);
    startedAt.current = null;

    if (elapsedMinutes > 0) {
      const startTime = `${pad2(started.getHours())}:${pad2(started.getMinutes())}`;
      const endTime = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
      await api.createFocus({
        date: selectedDate,
        category: mode === 'focus' ? (category.trim() || 'General') : 'Break',
        minutes: elapsedMinutes,
        type: mode,
        startTime,
        endTime,
      });
      refreshFocus();
    }
    reset(mode, minutes);
  };

  const finish = () => saveSession(totalRef.current, remaining);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const frac = totalRef.current ? remaining / totalRef.current : 1;
  const stroke = mode === 'focus' ? 'var(--pink)' : 'var(--teal)';

  return (
    <div className="panel pomodoro-panel">
      <div className="pomodoro-tabs">
        <button className={`tab-btn ${mode === 'focus' ? 'active' : ''}`} onClick={() => setModeSafe('focus')}>FOCUS</button>
        <button className={`tab-btn ${mode === 'break' ? 'active' : ''}`} onClick={() => setModeSafe('break')}>BREAK</button>
      </div>
      <div className="pomodoro-ring-wrap">
        <svg viewBox="0 0 120 120" className="pomodoro-ring">
          <circle cx="60" cy="60" r="52" className="ring-bg"></circle>
          <circle cx="60" cy="60" r="52" className="ring-fg" style={{ strokeDashoffset: RING_CIRC * (1 - frac), stroke }}></circle>
        </svg>
        <div className="pomodoro-center">
          <div className="timer-display">{pad2(m)}:{pad2(s)}</div>
          <div className="muted small">minutes</div>
        </div>
      </div>
      <div className="minutes-adjust">
        <input type="number" min={1} max={180} value={minutes} onChange={(e) => updateMinutes(e.target.value)} />
      </div>
      <div className="pomodoro-buttons">
        <button className="pill-btn" onClick={startPause}>{running ? 'PAUSE' : 'START'}</button>
        <button className="pill-btn accent" onClick={finish}>END</button>
      </div>
      <input className="category-input" placeholder="Category (e.g. Chinese)" value={category} onChange={(e) => setCategory(e.target.value)} />
    </div>
  );
}
