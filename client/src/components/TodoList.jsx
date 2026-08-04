import { useEffect, useState } from 'react';
import { usePlanner } from '../context/PlannerContext.jsx';
import * as api from '../api/client.js';

const FIXED_TODOS = 8;

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

  return (
    <div className="todo-block">
      <h4>To-Do</h4>
      <div className="todo-list">
        {Array.from({ length: FIXED_TODOS }).map((_, idx) => {
          const item = items[idx] || { text: '', done: false };
          return (
            <div className="todo-row" key={idx}>
              <input type="checkbox" checked={item.done} onChange={() => toggle(idx)} />
              <input
                type="text"
                value={item.text}
                placeholder="..."
                className={item.done ? 'done' : ''}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...next[idx], text: e.target.value };
                  setItems(next);
                }}
                onBlur={(e) => updateText(idx, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
