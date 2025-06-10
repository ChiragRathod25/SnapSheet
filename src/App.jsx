import React, { useState } from 'react';
import PaperSettings from './components/PaperSettings.jsx';
import ImageUploader from './components/ImageUploader';
import LayoutPreview from './components/LayoutPreview';
import ExportPDF from './components/ExportPDF.jsx';

export default function App() {
  const [paperSettings, setPaperSettings] = useState({
    size: 'A4',
    orientation: 'portrait',
    padding: 0.1,
    unit: 'in',
  });
  const [images, setImages] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 2, height: 2 });

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Passport Photo Layout Generator</h1>
      <PaperSettings settings={paperSettings} setSettings={setPaperSettings} />
      <ImageUploader images={images} setImages={setImages} />
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
      <LayoutPreview paper={paperSettings} images={images} imageSize={imageSize} />
      <ExportPDF paper={paperSettings} images={images} imageSize={imageSize} />
    </div>
  );
}
