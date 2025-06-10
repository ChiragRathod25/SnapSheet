import React from 'react';

export default function LayoutModeToggle({ mode, setMode, imagesPerPage, setImagesPerPage, paperSettings, setPaperSettings }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Layout Mode</h2>
      <label className="block mb-2">Select Layout Mode:</label>
      <select
        value={mode}
        onChange={e => setMode(e.target.value)}
        className="border p-2 mb-2"
      >
        <option value="manual">Manual (set size)</option>
        <option value="auto">Auto (set count)</option>
        <option value="grid">Grid (set rows x columns)</option>
      </select>

      {mode === 'auto' && (
        <input
          type="number"
          className="border p-2 block mb-2"
          value={imagesPerPage}
          onChange={e => setImagesPerPage(+e.target.value)}
          placeholder="Images per page"
        />
      )}
      {mode === 'grid' && (
        <div>
          <label className="block mb-1">Rows</label>
          <input
            type="number"
            value={paperSettings.rows || 2}
            onChange={e => setPaperSettings({ ...paperSettings, rows: +e.target.value })}
            className="border p-2 mr-2 w-24"
          />
          <label className="block mb-1">Columns</label>
          <input
            type="number"
            value={paperSettings.columns || 4}
            onChange={e => setPaperSettings({ ...paperSettings, columns: +e.target.value })}
            className="border p-2 w-24"
          />
        </div>
      )}
      <div className="mt-4">
        <label className="block mb-1 font-semibold">Margin Between Images (inches)</label>
        <input
          type="number"
          className="border p-2"
          value={paperSettings.margin || 0.00}
          onChange={e => setPaperSettings({ ...paperSettings, margin: +e.target.value })}
        />
      </div>
    </div>
  );
}
