import React, { useEffect, useRef } from 'react';
import { drawLayout } from '../utils/layoutUtils';

export default function LayoutPreview({ paper, images, imageSize, layoutMode, imagesPerPage, paperSettings }) {
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      drawLayout(canvasRef.current, paper, images, imageSize, layoutMode, imagesPerPage, paperSettings);
    }
  }, [paper, images, imageSize, layoutMode, imagesPerPage, paperSettings]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
      <canvas ref={canvasRef} className="border max-w-full" />
    </div>
  );
}