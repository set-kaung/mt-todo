const API_PREFIX = '/api';
const TOKEN_KEY = 'planner_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, opts = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_PREFIX}${path}`, {
    headers,
    ...opts,
  });
  if (res.status === 401) {
    clearToken();
    window.location.reload();
    return;
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
}

// Auth
export const login = (body) => fetch(`${API_PREFIX}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
}).then(async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  return res.json();
});

export const getMe = () => request('/auth/me');

// Events
export const getEvents = (month) => request(`/events?month=${month}`);
export const createEvent = (body) => request('/events', { method: 'POST', body: JSON.stringify(body) });
export const deleteEvent = (id) => request(`/events/${id}`, { method: 'DELETE' });

// Goals
export const getGoals = (month) => request(`/goals?month=${month}`);
export const setGoals = (body) => request('/goals', { method: 'PUT', body: JSON.stringify(body) });

// Habits
export const getHabits = () => request('/habits');
export const createHabit = (body) => request('/habits', { method: 'POST', body: JSON.stringify(body) });
export const renameHabit = (id, body) => request(`/habits/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const toggleHabit = (body) => request('/habits/toggle', { method: 'POST', body: JSON.stringify(body) });

// Timetable
export const getTimetable = () => request('/timetable');
export const createTimetable = (body) => request('/timetable', { method: 'POST', body: JSON.stringify(body) });
export const deleteTimetable = (id) => request(`/timetable/${id}`, { method: 'DELETE' });

// Weekly tasks
export const getWeeklyTasks = (weekStart) => request(`/weeklytasks?weekStart=${weekStart}`);
export const updateWeeklyTask = (body) => request('/weeklytasks', { method: 'POST', body: JSON.stringify(body) });
export const toggleWeeklyTask = (body) => request('/weeklytasks/toggle', { method: 'POST', body: JSON.stringify(body) });

// Resources
export const getResources = () => request('/resources');
export const createResource = (body) => request('/resources', { method: 'POST', body: JSON.stringify(body) });
export const deleteResource = (id) => request(`/resources/${id}`, { method: 'DELETE' });

// Todos
export const getTodos = (date) => request(`/todos?date=${date}`);
export const updateTodo = (body) => request('/todos', { method: 'POST', body: JSON.stringify(body) });
export const toggleTodo = (body) => request('/todos/toggle', { method: 'POST', body: JSON.stringify(body) });

// Focus
export const getFocus = (date) => request(`/focus?date=${date}`);
export const createFocus = (body) => request('/focus', { method: 'POST', body: JSON.stringify(body) });
export const deleteFocus = (id) => request(`/focus/${id}`, { method: 'DELETE' });
