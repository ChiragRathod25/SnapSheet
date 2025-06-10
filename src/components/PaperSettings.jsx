import React from 'react';

export default function PaperSettings({ settings, setSettings }) {
  const updatePadding = (side, value) => {
    setSettings(prev => ({ ...prev, [side]: parseFloat(value) || 0 }));
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Paper Settings</h2>
      <label className="block mt-2">Orientation:
        <select
          value={settings.orientation}
          onChange={e => setSettings(prev => ({ ...prev, orientation: e.target.value }))}
          className="border p-2 ml-2">
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </label>
      <div className="grid grid-cols-4 gap-2 mt-2">
        {['top', 'bottom', 'left', 'right'].map(side => (
          <input
            key={side}
            type="number"
            step="0.1"
            value={settings[side] || 0.1}
            onChange={e => updatePadding(side, e.target.value)}
            className="border p-2"
            placeholder={`${side} padding`}
          />
        ))}
      </div>
    </div>
  );
}
