import React, { useEffect, useRef } from 'react';
import { drawLayout } from '../utils/layoutUtils';

export default function LayoutPreview({ paper, images, imageSize }) {
  const canvasRef = useRef();

  useEffect(() => {
    drawLayout(canvasRef.current, paper, images, imageSize);
  }, [paper, images, imageSize]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Preview</h2>
      <canvas ref={canvasRef} className="border max-w-full" />
    </div>
  );
}