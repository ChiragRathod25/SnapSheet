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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center px-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-1">
            SnapSheet
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Smart Photo Layout Generator
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Paper Settings Card */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Paper Settings
            </h2>
            <PaperSettings settings={paperSettings} setSettings={setPaperSettings} />
          </div>

          {/* Layout Mode Toggle Card */}
          <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
              Layout Mode
            </h2>
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
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Upload & Manage Images
          </h2>
          <ImageUploader images={images} setImages={setImages} />
        </div>

        {/* Layout Preview */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Layout Preview
          </h2>
          <LayoutPreview
            paper={paperSettings}
            images={images}
            imageSize={imageSize}
            layoutMode={layoutMode}
            imagesPerPage={imagesPerPage}
            paperSettings={paperSettings}
          />
        </div>

        {/* Export Button */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
            Export to PDF
          </h2>
          <ExportPDF
            paper={paperSettings}
            images={images}
            imageSize={imageSize}
            layoutMode={layoutMode}
            imagesPerPage={imagesPerPage}
            paperSettings={paperSettings}
          />
        </div>
      </div>
    </div>
  );
}
