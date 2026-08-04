import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../api/client.js';
import { toISODate, getMonday, monthKey } from '../utils/dates.js';

const PlannerContext = createContext(null);

export function usePlanner() {
  const ctx = useContext(PlannerContext);
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider');
  return ctx;
}

export function PlannerProvider({ children }) {
  const [today] = useState(() => new Date());
  const [calMonth, setCalMonth] = useState(new Date());
  const [miniCalMonth, setMiniCalMonth] = useState(new Date());
  const [weekMonday, setWeekMonday] = useState(getMonday(new Date()));
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [allFocus, setAllFocus] = useState([]);
  const [timetable, setTimetable] = useState([]);

  const refreshFocus = useCallback(async () => {
    const data = await api.getFocus();
    setAllFocus(data.sessions || []);
  }, []);

  const refreshTimetable = useCallback(async () => {
    const data = await api.getTimetable();
    setTimetable(data);
  }, []);

  useEffect(() => {
    refreshFocus();
    refreshTimetable();
  }, [refreshFocus, refreshTimetable]);

  const value = {
    today,
    calMonth,
    setCalMonth,
    miniCalMonth,
    setMiniCalMonth,
    weekMonday,
    setWeekMonday,
    selectedDate,
    setSelectedDate,
    allFocus,
    refreshFocus,
    timetable,
    refreshTimetable,
  };

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export { monthKey };
