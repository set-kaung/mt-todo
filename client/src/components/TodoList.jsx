import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';

export default function TodoList() {
  const { selectedDate } = usePlanner();
  const [items, setItems] = useState([]);

  const load = async () => {
    const data = await api.getTodos(selectedDate);
    setItems(data);
  };

  useEffect(() => { load(); }, [selectedDate]);

  const updateText = async (idx, text) => {
    await api.updateTodo({ date: selectedDate, index: idx, text });
    load();
  };

  const toggle = async (idx) => {
    await api.toggleTodo({ date: selectedDate, index: idx });
    load();
  };

  const addTodo = async () => {
    const nextIndex = items.length ? Math.max(...items.map((i) => i.index)) + 1 : 0;
    await api.updateTodo({ date: selectedDate, index: nextIndex, text: '' });
    load();
  };

  return (
    <div className="todo-block">
      <h4>To-Do</h4>
      <div className="todo-list">
        {items.length === 0 && <div className="empty-note">No todos yet.</div>}
        {items.map((item) => (
          <div className="todo-row" key={item.index}>
            <input type="checkbox" checked={item.done} onChange={() => toggle(item.index)} />
            <input
              type="text"
              value={item.text}
              placeholder="..."
              className={item.done ? 'done' : ''}
              onChange={(e) => {
                const next = items.map((i) => (i.index === item.index ? { ...i, text: e.target.value } : i));
                setItems(next);
              }}
              onBlur={(e) => updateText(item.index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button className="pill-btn" onClick={addTodo}>+ Add todo</button>
    </div>
  );
}
