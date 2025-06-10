import React, { useState } from 'react';
import PaperSettings from './components/PaperSettings';
import ImageUploader from './components/ImageUploader';
import LayoutPreview from './components/LayoutPreview';
import ExportPDF from './components/ExportPDF';
import LayoutModeToggle from './components/LayoutModeToggle';

export default function App() {
  const [paperSettings, setPaperSettings] = useState({
    size: 'A4',
    orientation: 'portrait',
    padding: 0.1,
    unit: 'in',
    hSpacing: 0.1,
    vSpacing: 0.1,
  });
  const [images, setImages] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 2, height: 2 });
  const [layoutMode, setLayoutMode] = useState('manual');
  const [imagesPerPage, setImagesPerPage] = useState(8);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Passport Photo Layout Generator</h1>
      <PaperSettings settings={paperSettings} setSettings={setPaperSettings} />
      <LayoutModeToggle
        mode={layoutMode}
        setMode={setLayoutMode}
        imagesPerPage={imagesPerPage}
        setImagesPerPage={setImagesPerPage}
        paperSettings={paperSettings}
      />
      <ImageUploader images={images} setImages={setImages} />
      {layoutMode === 'manual' && (
        <div className="my-4">
          <label className="block mb-1 font-semibold">Image Size (inches)</label>
          <input
            type="number"
            value={imageSize.width}
            onChange={e => setImageSize({ ...imageSize, width: +e.target.value })}
            className="border p-2 mr-2 w-24"
            placeholder="Width"
          />
          <input
            type="number"
            value={imageSize.height}
            onChange={e => setImageSize({ ...imageSize, height: +e.target.value })}
            className="border p-2 w-24"
            placeholder="Height"
          />
        </div>
      )}
      <div className="my-4">
        <label className="block font-semibold mb-1">Horizontal Spacing (inches)</label>
        <input
          type="number"
          value={paperSettings.hSpacing}
          onChange={e => setPaperSettings({ ...paperSettings, hSpacing: +e.target.value })}
          className="border p-2 w-24 mr-4"
        />
        <label className="block font-semibold mb-1 mt-2">Vertical Spacing (inches)</label>
        <input
          type="number"
          value={paperSettings.vSpacing}
          onChange={e => setPaperSettings({ ...paperSettings, vSpacing: +e.target.value })}
          className="border p-2 w-24"
        />
      </div>
      <LayoutPreview
        paper={paperSettings}
        images={images}
        imageSize={imageSize}
        layoutMode={layoutMode}
        imagesPerPage={imagesPerPage}
      />
      <ExportPDF
        paper={paperSettings}
        images={images}
        imageSize={imageSize}
        layoutMode={layoutMode}
        imagesPerPage={imagesPerPage}
      />
    </div>
  );
}