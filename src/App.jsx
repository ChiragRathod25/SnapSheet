import React, { useState } from "react";
import PaperSettings from "./components/PaperSettings.jsx";
import ImageUploader from "./components/ImageUploader.jsx";
import LayoutPreview from "./components/LayoutPreview.jsx";
import ExportPDF from "./components/ExportPDF.jsx";
import LayoutModeToggle from "./components/LayoutModeToggle.jsx";

function AccordionSection({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow mb-4 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-gray-800 text-lg bg-gray-100 hover:bg-gray-200 transition-all"
      >
        <span>{title}</span>
        <svg
          className={`h-5 w-5 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
}

export default function App() {
  const [paperSettings, setPaperSettings] = useState({
    size: "a4",
    orientation: "portrait",
    padding: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
    imageSpacing: 0.15,
    backgroundColor: "#ffffff",
    showGridLines: false,
  });

  const [images, setImages] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 2, height: 2 });
  const [layoutMode, setLayoutMode] = useState("manual");
  const [imagesPerPage, setImagesPerPage] = useState(8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-4">
        {/* App Title */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 mb-1">
            SnapSheet
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Smart Photo Layout Generator
          </p>
        </div>

        {/* Accordion Sections */}
        <AccordionSection title="1. Paper Settings">
          <PaperSettings settings={paperSettings} setSettings={setPaperSettings} />
        </AccordionSection>

        <AccordionSection title="2. Layout Mode & Image Size">
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
        </AccordionSection>

        <AccordionSection title="3. Upload Images">
          <ImageUploader images={images} setImages={setImages} />
        </AccordionSection>

        <AccordionSection title="4. Layout Preview">
          <LayoutPreview
            paper={paperSettings}
            images={images}
            imageSize={imageSize}
            layoutMode={layoutMode}
            imagesPerPage={imagesPerPage}
            paperSettings={paperSettings}
          />
        </AccordionSection>

        <AccordionSection title="5. Export to PDF">
          <ExportPDF
            paper={paperSettings}
            images={images}
            imageSize={imageSize}
            layoutMode={layoutMode}
            imagesPerPage={imagesPerPage}
            paperSettings={paperSettings}
          />
        </AccordionSection>
      </div>
    </div>
  );
}
