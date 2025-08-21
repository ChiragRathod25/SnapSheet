import React from "react";

export default function LayoutModeToggle({
  mode,
  setMode,
  imagesPerPage,
  setImagesPerPage,
  paperSettings,
  setPaperSettings,
  imageSize,
  setImageSize,
}) {
  return (
    <div className="mb-4 p-4 border rounded-lg bg-gray-50">
      <h2 className="text-xl font-semibold mb-3">Layout Mode</h2>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Layout Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border p-2 mb-2 rounded w-full max-w-xs"
        >
          <option value="manual">Manual (set size)</option>
          <option value="auto">Auto (set count)</option>
          <option value="grid">Grid (set rows x columns)</option>
        </select>
      </div>

      {mode === "manual" && (
        <div className="my-4">
          <label className="block mb-1 font-semibold">
            Image Size (inches)
          </label>
          <input
            type="number"
            value={imageSize.width}
            onChange={(e) =>
              setImageSize({ ...imageSize, width: +e.target.value })
            }
            className="border p-2 mr-2 w-24"
            placeholder="Width"
          />
          <input
            type="number"
            value={imageSize.height}
            onChange={(e) =>
              setImageSize({ ...imageSize, height: +e.target.value })
            }
            className="border p-2 w-24"
            placeholder="Height"
          />
        </div>
      )}

      {mode === "auto" && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Images per page:</label>
          <input
            type="number"
            className="border p-2 rounded w-24"
            value={imagesPerPage}
            onChange={(e) => setImagesPerPage(Math.max(1, +e.target.value))}
            placeholder="8"
            min="1"
            max="50"
          />
          <p className="text-sm text-gray-600 mt-1">
            Enter any number (e.g., 8, 10, 16, 20) to create a perfect grid
          </p>
        </div>
      )}

      {mode === "grid" && (
        <div className="mb-4">
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block mb-1 font-medium">Rows:</label>
              <input
                type="number"
                value={paperSettings.rows || 2}
                onChange={(e) =>
                  setPaperSettings({
                    ...paperSettings,
                    rows: Math.max(1, +e.target.value),
                  })
                }
                className="border p-2 rounded w-20"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Columns:</label>
              <input
                type="number"
                value={paperSettings.columns || 4}
                onChange={(e) =>
                  setPaperSettings({
                    ...paperSettings,
                    columns: Math.max(1, +e.target.value),
                  })
                }
                className="border p-2 rounded w-20"
                min="1"
                max="10"
              />
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Total images per page:{" "}
            {(paperSettings.rows || 2) * (paperSettings.columns || 4)}
          </p>
        </div>
      )}

      <div className="mt-4">
        <label className="block mb-2 font-medium">
          Margin Between Images (inches):
        </label>
        <input
          type="number"
          className="border p-2 rounded w-24"
          value={paperSettings.margin || 0.15}
          onChange={(e) =>
            setPaperSettings({
              ...paperSettings,
              margin: Math.max(0, +e.target.value),
            })
          }
          step="0.05"
          min="0"
          max="1"
        />
      </div>
    </div>
  );
}
