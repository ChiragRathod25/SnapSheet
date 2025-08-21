import React from 'react';

export default function PaperSettings({ settings, setSettings }) {
  const updatePadding = (side, value) => {
    setSettings(prev => ({ 
      ...prev, 
      padding: {
        ...prev.padding,
        [side]: parseFloat(value) || 0
      }
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mb-6 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Paper Settings</h2>
      
      {/* Paper Size */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Paper Size:</label>
        <select
          value={settings.size || 'a4'}
          onChange={e => updateSetting('size', e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="a4">A4 (8.27" × 11.69")</option>
          <option value="letter">Letter (8.5" × 11")</option>
          <option value="legal">Legal (8.5" × 14")</option>
        </select>
      </div>

      {/* Orientation */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Orientation:</label>
        <select
          value={settings.orientation || 'portrait'}
          onChange={e => updateSetting('orientation', e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="portrait">Portrait</option>
          <option value="landscape">Landscape</option>
        </select>
      </div>

      {/* Page Padding/Margins */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Page Margins (inches):</label>
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          {['top', 'bottom', 'left', 'right'].map(side => (
            <div key={side}>
              <label className="block text-sm mb-1 capitalize">{side}:</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                value={settings.padding?.[side] || 0.5}
                onChange={e => updatePadding(side, e.target.value)}
                className="border p-2 rounded w-full"
                placeholder={`${side}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Image Spacing */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Space Between Images (inches):</label>
        <input
          type="number"
          step="0.05"
          min="0"
          max="1"
          value={settings.imageSpacing || 0.15}
          onChange={e => updateSetting('imageSpacing', parseFloat(e.target.value) || 0)}
          className="border p-2 rounded w-24"
        />
      </div>

      {/* Background Color */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Background Color:</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={settings.backgroundColor || '#ffffff'}
            onChange={e => updateSetting('backgroundColor', e.target.value)}
            className="border rounded w-12 h-8"
          />
          <span className="text-sm text-gray-600">
            {settings.backgroundColor || '#ffffff'}
          </span>
        </div>
      </div>

      {/* Show Grid Lines */}
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.showGridLines || false}
            onChange={e => updateSetting('showGridLines', e.target.checked)}
            className="rounded"
          />
          <span className="font-medium">Show grid lines (preview only)</span>
        </label>
      </div>
      
    </div>
  );
}