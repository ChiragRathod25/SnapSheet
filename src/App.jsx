import React, { useState } from "react";
import PaperSettings from "./components/PaperSettings.jsx";
import ImageUploader from "./components/ImageUploader.jsx";
import LayoutPreview from "./components/LayoutPreview.jsx";
import ExportPDF from "./components/ExportPDF.jsx";
import LayoutModeToggle from "./components/LayoutModeToggle.jsx";

export default function App() {
 const [paperSettings, setPaperSettings] = useState({
  size: 'a4',
  orientation: 'portrait',
  padding: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
  imageSpacing: 0.15,
  backgroundColor: '#ffffff',
  showGridLines: false
});
  const [images, setImages] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 2, height: 2 });
  const [layoutMode, setLayoutMode] = useState("manual");
  const [imagesPerPage, setImagesPerPage] = useState(8);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        SnapSheet : Photo Layout Generator
      </h1>
      <PaperSettings settings={paperSettings} setSettings={setPaperSettings} />
      <LayoutModeToggle
        mode={layoutMode}
        setMode={setLayoutMode}
        imagesPerPage={imagesPerPage}
        setImagesPerPage={setImagesPerPage}
        paperSettings={paperSettings}
        setPaperSettings={setPaperSettings}
        imageSize={imageSize}
        setImageSize={setImageSize}
      />

      <ImageUploader images={images} setImages={setImages} />

      <LayoutPreview
        paper={paperSettings}
        images={images}
        imageSize={imageSize}
        layoutMode={layoutMode}
        imagesPerPage={imagesPerPage}
        paperSettings={paperSettings} // ADD THIS
      />
      <ExportPDF
        paper={paperSettings}
        images={images}
        imageSize={imageSize}
        layoutMode={layoutMode}
        imagesPerPage={imagesPerPage}
        paperSettings={paperSettings} // ADD THIS
      />
    </div>
  );
}
