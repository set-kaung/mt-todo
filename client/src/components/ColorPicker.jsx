import { useState } from 'react';

const SWATCHES = [
  '#f9a8d4', '#fcd9b6', '#a7e8dc', '#c7d2fe',
  '#d5f5c3', '#fdf1b8', '#f8b4b4', '#b4d4f8',
];

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export default function ColorPicker({ value, onChange }) {
  const [draft, setDraft] = useState(value || '#f9a8d4');
  const current = HEX_RE.test(value || '') ? value : '#000000';

  return (
    <div className="color-picker">
      <div className="color-swatches">
        {SWATCHES.map((c) => (
          <button
            type="button"
            key={c}
            className={`color-swatch ${c.toLowerCase() === current.toLowerCase() ? 'selected' : ''}`}
            style={{ background: c }}
            title={c}
            onClick={() => { setDraft(c); onChange(c); }}
          />
        ))}
      </div>
      <div className="color-hex-row">
        <span className="color-preview" style={{ background: current }} />
        <input
          className="color-hex-input"
          value={draft}
          maxLength={7}
          onChange={(e) => {
            setDraft(e.target.value);
            if (HEX_RE.test(e.target.value)) onChange(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
