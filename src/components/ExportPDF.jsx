import React from 'react';
import { drawLayoutToPDF } from '../utils/layoutUtils';

export default function ExportPDF({ paper, images, imageSize, layoutMode, imagesPerPage, paperSettings }) {
  const handleExport = () => {
    if (images.length === 0) {
      alert('Please add some images before exporting to PDF');
      return;
    }
    
    drawLayoutToPDF(paper, images, imageSize, layoutMode, imagesPerPage, paperSettings);
  };

  return (
    <button
      onClick={handleExport}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={images.length === 0}
    >
      Export as PDF {images.length > 0 && `(${images.length} images)`}
    </button>
  );
}
