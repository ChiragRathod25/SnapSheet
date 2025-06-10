import React from 'react';
import { drawLayoutToPDF } from '../utils/layoutUtils';

export default function ExportPDF({ paper, images, imageSize }) {
  return (
    <button
      onClick={() => drawLayoutToPDF(paper, images, imageSize)}
      className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Export as PDF
    </button>
  );
}
