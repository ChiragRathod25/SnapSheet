import React from 'react';

export default function ImageUploader({ images, setImages }) {
  const handleUpload = e => {
    const files = Array.from(e.target.files);
    const urls = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...urls]);
  };

  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Upload Images</h2>
      <input type="file" multiple onChange={handleUpload} accept="image/*" />
      <div className="flex flex-wrap mt-2 gap-2">
        {images.map((img, i) => (
          <img key={i} src={img} alt="preview" className="w-20 h-20 object-cover border" />
        ))}
      </div>
    </div>
  );
}