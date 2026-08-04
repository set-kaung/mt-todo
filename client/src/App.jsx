import Header from './components/Header.jsx';
import SchedulePanel from './components/SchedulePanel.jsx';
import CalendarPanel from './components/CalendarPanel.jsx';
import GoalsPanel from './components/GoalsPanel.jsx';
import HabitTracker from './components/HabitTracker.jsx';
import MiniCalendar from './components/MiniCalendar.jsx';
import WeeklyTimetable from './components/WeeklyTimetable.jsx';
import AddTimetableForm from './components/AddTimetableForm.jsx';
import WeekBulletBoard from './components/WeekBulletBoard.jsx';
import DailyTimetable from './components/DailyTimetable.jsx';
import PomodoroTimer from './components/PomodoroTimer.jsx';
import Resources from './components/Resources.jsx';
import Vinyl from './components/Vinyl.jsx';
import TodoList from './components/TodoList.jsx';
import DailyFocusKPI, { WeeklyFocusKPI } from './components/DailyFocusKPI.jsx';

export default function App() {
  return (
    <div className="app">
      <Header />
      <section className="row row1">
        <SchedulePanel />
        <CalendarPanel />
        <GoalsPanel />
      </section>
      <section className="row row2">
        <div className="panel habit-panel">
          <HabitTracker />
          <MiniCalendar />
        </div>
        <WeeklyTimetable />
        <div className="panel addtimetable-panel">
          <AddTimetableForm />
          <WeeklyFocusKPI />
        </div>
      </section>
      <WeekBulletBoard />
      <section className="row row4">
        <DailyTimetable />
        <div className="panel pomodoro-panel">
          <PomodoroTimer />
          <Resources />
        </div>
        <div className="panel side-panel">
          <Vinyl />
          <TodoList />
          <DailyFocusKPI />
        </div>
      </section>
    </div>
  );
}
