import { useEffect, useState } from 'react';
import * as api from '../api/client.js';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  const load = async () => {
    const data = await api.getResources();
    setResources(data);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim() || !link.trim()) return;
    await api.createResource({ name, link });
    setName(''); setLink('');
    load();
  };

  const remove = async (id) => {
    await api.deleteResource(id);
    load();
  };

  return (
    <div className="resources-block">
      <h4>Resources</h4>
      <form className="stacked-form" onSubmit={add}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label>
        <label>Link<input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." required /></label>
        <button className="ghost-btn" type="submit">ADD</button>
      </form>
      <div className="resource-list">
        {resources.length === 0 && <div className="empty-note">No resources yet.</div>}
        {resources.map((r) => (
          <div className="resource-item" key={r.id}>
            <a href={r.link} target="_blank" rel="noopener noreferrer">🔗 {r.name}</a>
            <button onClick={() => remove(r.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
