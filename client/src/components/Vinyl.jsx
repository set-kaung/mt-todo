import { useState } from 'react';

export default function Vinyl() {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="vinyl-wrap" onClick={() => setPlaying((p) => !p)} title="Click to play / pause music">
      <div className={`vinyl ${playing ? 'spinning' : ''}`}>
        <div className="vinyl-label"></div>
      </div>
      <div className="tonearm"></div>
    </div>
  );
}
